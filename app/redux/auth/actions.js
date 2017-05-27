import firebase from 'firebase';
import { path } from 'ramda'
import { call, take } from 'redux-saga/effects';
import { firebaseAuth } from 'utils/firebase';
import { actionsGenerator, redirect } from 'redux/utils'
import CurrentRelay, { CreateUserMutation, userNameQuery } from 'relay';
import moment from 'moment';
import { stackexchange, stackexchangeConfig } from 'utils/stackexchange';

const getUserName = userId => CurrentRelay.fetch({
  query: userNameQuery(userId),
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
    const userId = user.uid
    const userInfo = yield call(getUserName, userId)
    let userName = path(['user', 'userName'], userInfo)

    if (!userName) {
      try {
        userName = yield call(getNameAndCreateUser, {
          userId: user.firebaseId, ...user,
        })
        localStorage.setItem('providerAuthEmail', userName)
        return { user, userName }
      } catch (ex) {
        throw new Error({ message: 'Cannot login' })
      }
    }

    return { user, userName }
  }

  throw new Error({ message: 'No user' })
}

function* getNameAndCreateUser(user, provider = 'firebase') {
  yield call(redirect, '/login')
  authActions.userNameNotAvail(user.displayName || 'Guest')
  const { payload } = yield take(authActions.addUsername.getType())

  yield call(CurrentRelay.Store.commitUpdate, new CreateUserMutation({
    userId: user.uid,
    fullName: user.displayName,
    photoUrl: user.photoURL,
    emailAddress: user.email,
    accessToken: user.accessToken || null,
    userName: payload.userName,
    password: payload.password,
    provider,
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
  let userId = ''
  let accessToken = ''
  let displayName = ''
  let photoURL = ''
  let expirationDate = ''

  const seUser = localStorage.getItem('seUser')
  const seExpire = localStorage.getItem('seExpire')
  if (seUser && seExpire && (
    moment().isBefore(moment.unix(seExpire))
  )) {
    userId = seUser
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
      userId = `stackexchange${user_id}` // eslint-disable-line
      accessToken = seAuth.accessToken
      displayName = display_name // eslint-disable-line
      photoURL = profile_image // eslint-disable-line
      expirationDate = seAuth.expirationDate
    }
  }

  yield call(
    CurrentRelay.reset, null, 'stackexchange',
    JSON.stringify({ token: accessToken, userId }),
  )
  const userInfo = yield call(getUserName, userId)
  let userName = path(['user', 'userName'], userInfo)

  if (!userName && expirationDate) {
    const user = {
      uid: userId,
      displayName,
      photoURL,
      email: null,
      accessToken,
      provider: 'stackexchange',
    }

    userName = yield call(getNameAndCreateUser, user, 'stackexchange')
    const expire = moment(expirationDate).unix()
    localStorage.setItem('seUser', userId)
    localStorage.setItem('seAccessToken', accessToken)
    localStorage.setItem('seExpire', expire)

    return { user, userName }
  }

  if (userInfo && userName) {
    const user = {
      uid: userId,
      displayName: path(['user', 'fullName'], userInfo),
      photoURL: path(['user', 'photoUrl'], userInfo),
      email: null,
      accessToken,
      provider: 'stackexchange',
    }
    return { user, userName }
  }

  throw new Error({ message: 'No username' })
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
})

export const signInWithGithub = () => authActions.signIn.init({
  authProvider: new firebase.auth.GithubAuthProvider(),
});

export const signInWithGoogle = () => authActions.signIn.init({
  authProvider: new firebase.auth.GoogleAuthProvider(),
});
