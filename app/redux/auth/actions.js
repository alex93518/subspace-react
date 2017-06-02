import firebase from 'firebase';
import { path } from 'ramda'
import { call, take } from 'redux-saga/effects';
import { firebaseAuth } from 'utils/firebase';
import { getGithubUserInfo } from 'utils/github';
import { actionsGenerator, redirect } from 'redux/utils'
import CurrentRelay, {
  CreateUserMutation, userProviderQuery, userNameQuery, AddUserProviderMutation,
} from 'relay';
import moment from 'moment';
import { stackexchange, stackexchangeConfig } from 'utils/stackexchange';

const getUserName = userId => CurrentRelay.fetch({
  query: userNameQuery(userId),
})

const getUserProvider = (
  providerId, provider, firebaseId
) => CurrentRelay.fetch({
  query: userProviderQuery(providerId, provider, firebaseId),
})

function* createUserWithEmailPassword({ payload }) {
  const { userName, email, password } = payload
  const user = yield call(
    [firebaseAuth, firebaseAuth.createUserWithEmailAndPassword],
    email,
    password
  )

  yield call(CurrentRelay.Store.commitUpdate, new CreateUserMutation({
    firebaseId: user.uid,
    emailAddress: email,
    userName,
    password,
  }));

  yield call(CurrentRelay.reset)
  return { user, userName }
}

function* signIn({ payload: { authProvider } }) {
  const usedEmail = localStorage.getItem('providerAuthEmail')
  if (usedEmail) {
    authProvider.setCustomParameters({
      login_hint: usedEmail,
    })
  }

  const { user } = yield call(
    [firebaseAuth, firebaseAuth.signInWithPopup],
    authProvider
  )

  if (user) {
    yield call(CurrentRelay.reset, null, 'firebase', user._lat) // eslint-disable-line
    const providerId = user.providerData[0].uid
    const firebaseId = user.uid
    const provider = `firebase-${user.providerData[0].providerId}`
    let fullName = user.displayName
    let photoUrl = user.photoURL
    let emailAddress = user.email

    const { userProvider } = yield call(
      getUserProvider, providerId, provider, firebaseId
    )

    if (!userProvider) {
      if (user.providerData[0].providerId === 'github.com') {
        let githubInfo = yield call(getGithubUserInfo, providerId)
        githubInfo = yield githubInfo.json()

        photoUrl = githubInfo.avatar_url
        fullName = githubInfo.login
        emailAddress = githubInfo.email
      }

      const userPayload = {
        userName,
        fullName,
        photoUrl,
        emailAddress,
        provider,
        providerId,
        firebaseId,
        displayName: fullName,
      }
      try {
        const userName = yield call(getNameAndCreateUser, userPayload)
        localStorage.setItem('providerAuthEmail', userName)
        return { user: userPayload, userName }
      } catch (ex) {
        throw new Error({ message: 'Cannot login' })
      }
    }

    const userInfo = yield call(getUserName, userProvider.userId)
    const userName = path(['user', 'userName'], userInfo)
    if (userName) {
      const userRet = {
        ...userInfo.user,
        displayName: userInfo.user.fullName,
      }
      return { user: userRet, userName }
    }

    throw new Error({ message: 'Cannot login' })
  }

  throw new Error({ message: 'No user' })
}

function* addFirebaseProvider({
  payload: { id, userId, authProvider, callback },
}) {
  const { user } = yield call(
    [firebaseAuth, firebaseAuth.signInWithPopup],
    authProvider
  )

  if (user) {
    const providerId = user.providerData[0].uid
    // TODO: for github provider, fetch login name first, assign it to userName
    const userName = user.displayName
    const firebaseId = user.uid
    const provider = `firebase-${user.providerData[0].providerId}`
    yield call(CurrentRelay.Store.commitUpdate, new AddUserProviderMutation({
      id,
      userId,
      userName,
      provider,
      providerId,
      firebaseId,
    }));

    if (callback) callback(providerId)
    return true;
  }

  throw new Error({ message: 'Cannot login to provider' })
}

function* getNameAndCreateUser(user) {
  yield call(redirect, '/login')
  authActions.userNameNotAvail(user.displayName || 'Guest')
  const { payload } = yield take(authActions.addUsername.getType())

  yield call(CurrentRelay.Store.commitUpdate, new CreateUserMutation({
    ...user,
    accessToken: user.accessToken || null,
    userName: payload.userName,
    password: payload.password,
  }));

  return payload.userName
}

function* signInWithEmailPassword({ payload: { email, password } }) {
  const user = yield call(
    [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
    email,
    password
  );

  const userInfo = yield call(getUserName, user.uid)
  const userName = path(['user', 'userName'], userInfo)

  if (userName) {
    yield call(CurrentRelay.reset)
    return { user, userName }
  }

  throw new Error({ message: 'No username' })
}

function* signInWithStackexchange() {
  let providerId = ''
  let accessToken = ''
  let displayName = ''
  let photoUrl = ''
  let expirationDate = ''

  const seProviderId = localStorage.getItem('seProviderId')
  const seExpire = localStorage.getItem('seExpire')

  if (seProviderId && seExpire && (
    moment().isBefore(moment.unix(seExpire))
  )) {
    providerId = seProviderId
    accessToken = localStorage.getItem('seAccessToken')
  } else {
    const init = () => (
      new Promise(resolve => {
        stackexchange.init({
          ...stackexchangeConfig,
          channelUrl: 'http://localhost/blank.html',
          complete: resolve,
        })
      })
    )

    const auth = () => (
      new Promise(resolve => {
        stackexchange.authenticate({
          networkUsers: true,
          success: resolve,
        })
      })
    )

    yield call(init)
    const seAuth = yield call(auth)
    if (seAuth && seAuth.networkUsers.length > 0) {
      const userData = seAuth.networkUsers[0]
      const { user_id, display_name, profile_image } = userData
      providerId = String(user_id) // eslint-disable-line
      accessToken = seAuth.accessToken
      displayName = display_name // eslint-disable-line
      photoUrl = profile_image // eslint-disable-line
      expirationDate = seAuth.expirationDate
    }
  }

  yield call(
    CurrentRelay.reset, null, 'stackexchange',
    JSON.stringify({ token: accessToken, providerId }),
  )
  const userProvider = yield call(
    getUserProvider, providerId, 'stackexchange', null
  )

  // User exists
  if (userProvider) {
    const userInfo = yield call(getUserName, userProvider.userId)
    const userName = path(['user', 'userName'], userInfo)
    if (userInfo && userName) {
      const user = {
        displayName: path(['user', 'fullName'], userInfo),
        fullName: path(['user', 'fullName'], userInfo),
        photoUrl: path(['user', 'photoUrl'], userInfo),
        email: null,
        accessToken,
        provider: 'stackexchange',
        providerId,
      }
      return { user, userName }
    }
  }

  // User not exists, create one.
  try {
    const user = {
      displayName,
      fullName: displayName,
      photoUrl,
      email: null,
      accessToken,
      provider: 'stackexchange',
      providerId,
    }

    const userName = yield call(getNameAndCreateUser, user, 'stackexchange')
    const expire = moment(expirationDate).unix()
    localStorage.setItem('seProviderId', providerId)
    localStorage.setItem('seAccessToken', accessToken)
    localStorage.setItem('seExpire', expire)

    return { user, userName }
  } catch (ex) {
    localStorage.removeItem('seProviderId')
    localStorage.removeItem('seAccessToken')
    localStorage.removeItem('seExpire')
    throw new Error({ message: 'No username' })
  }
}

function* addStackexchangeProviderFn({ payload: { id, userId, callback } }) {
  const init = () => (
    new Promise(resolve => {
      stackexchange.init({
        ...stackexchangeConfig,
        channelUrl: 'http://localhost/blank.html',
        complete: resolve,
      })
    })
  )

  const auth = () => (
    new Promise(resolve => {
      stackexchange.authenticate({
        networkUsers: true,
        success: resolve,
      })
    })
  )

  yield call(init)
  const seAuth = yield call(auth)
  if (seAuth && seAuth.networkUsers.length > 0) {
    const provider = 'stackexchange';
    const providerId = String(seAuth.networkUsers[0].user_id)
    const userName = String(seAuth.networkUsers[0].display_name)
    const accessToken = seAuth.accessToken
    yield call(CurrentRelay.Store.commitUpdate, new AddUserProviderMutation({
      id,
      userId,
      userName,
      provider,
      providerId,
      accessToken,
    }));

    if (callback) callback(providerId)
    return true;
  }

  throw new Error({ message: 'Cannot login to provider' })
}

function* signOut() {
  yield call(redirect, '/login')
  yield call([firebaseAuth, firebaseAuth.signOut])
  yield call(CurrentRelay.reset)
}

export const authActions = actionsGenerator({
  createUserWithEmailPassword,
  signIn,
  signInWithEmailPassword,
  signOut,
  addUsername: null,
  userNameNotAvail: null,
  signInWithStackexchange,
  addFirebaseProvider,
  addStackexchangeProviderFn,
})

export const signInWithGithub = () => authActions.signIn.init({
  authProvider: new firebase.auth.GithubAuthProvider(),
});

export const addGithubProvider = (id, userId, callback) =>
  authActions.addFirebaseProvider.init({
    id,
    userId,
    authProvider: new firebase.auth.GithubAuthProvider(),
    callback,
  });

export const signInWithGoogle = () => authActions.signIn.init({
  authProvider: new firebase.auth.GoogleAuthProvider(),
});

export const addGoogleProvider = (id, userId, callback) =>
  authActions.addFirebaseProvider.init({
    id,
    userId,
    authProvider: new firebase.auth.GoogleAuthProvider(),
    callback,
  });

export const addStackexchangeProvider = (id, userId, callback) =>
  authActions.addStackexchangeProviderFn.init({
    id,
    userId,
    callback,
  })
