import firebase from 'firebase';
import { call, take } from 'redux-saga/effects';
import { firebaseAuth } from 'utils/firebase';
import { actionsGenerator, redirect } from 'redux/utils'
import CurrentRelay, { CreateUserMutation, userNameQuery } from 'relay';

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

  yield call(CurrentRelay.reset)
  localStorage.setItem('providerAuthEmail', user.email)
  let { user: { userName } } = yield call(getUserName, user.uid)

  if (!userName) {
    userName = yield call(getNameAndCreateUser, user)
  }

  return { user, userName }
}

function* getNameAndCreateUser(user) {
  yield call(redirect, '/login')
  authActions.userNameNotAvail(user.displayName || 'Guest')
  const { payload } = yield take(authActions.addUsername.getType())

  yield call(CurrentRelay.Store.commitUpdate, new CreateUserMutation({
    firebaseId: user.uid,
    fullName: user.displayName,
    photoUrl: user.photoURL,
    emailAddress: user.email,
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

  const { user: { userName } } = yield call(getUserName, user.uid)
  if (userName) {
    yield call(CurrentRelay.reset)
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
})

export const signInWithGithub = () => authActions.signIn.init({
  authProvider: new firebase.auth.GithubAuthProvider(),
});

export const signInWithGoogle = () => authActions.signIn.init({
  authProvider: new firebase.auth.GoogleAuthProvider(),
});
