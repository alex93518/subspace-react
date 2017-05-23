import firebase from 'firebase';
import { path } from 'ramda'
import { call, take } from 'redux-saga/effects';
import { firebaseAuth } from 'utils/firebase';
import { actionsGenerator, redirect } from 'redux/utils'
import CurrentRelay, { CreateUserMutation, userNameQuery } from 'relay';
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
    yield call(CurrentRelay.reset, null, user._lat) // eslint-disable-line
    const userInfo = yield call(getUserName, user.uid)
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

  const fetchUser = authData => (
    new Promise(resolve => {
      const accessToken = authData.accessToken
      const userUrl = `https://api.stackexchange.com/2.2/me?site=stackoverflow&access_token=${accessToken}&key=${stackexchangeConfig.key}`
      fetch(userUrl).then(resolve)
    })
  )

  const getUser = seFetchUser => (
    new Promise(resolve => {
      seFetchUser.json().then(resolve)
    })
  )

  yield call(init)
  const seAuth = yield call(auth)
  const seFetchUser = yield call(fetchUser, seAuth)
  const seUser = yield call(getUser, seFetchUser)

  if (seUser && seUser.items.length > 0) {
    const userData = seUser.items[0]
    const { user_id, display_name, profile_image } = userData
    const userId = `stackexchange${user_id}` // eslint-disable-line
    yield call(
      CurrentRelay.reset, null,
      JSON.stringify({ token: seAuth.accessToken, userId }),
      'stackexchange'
    )
    const userInfo = yield call(getUserName, userId)
    let userName = path(['user', 'userName'], userInfo)

    const user = {
      uid: userId,
      displayName: display_name,
      photoURL: profile_image,
      email: null,
      accessToken: seAuth.accessToken,
    }

    if (!userName) {
      userName = yield call(getNameAndCreateUser, user, 'stackexchange')
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
