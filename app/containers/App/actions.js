import firebase from 'firebase';
import { call, put, take } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { firebaseAuth } from 'utils/firebase';
import { actionsGenerator } from 'redux/utils'
import CurrentRelay, { CreateUserMutation } from 'relay';

const getUserName = userId => fetch(process.env.GRAPHQL_ENDPOINT, {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'POST',
  body: JSON.stringify({
    query: 'query User($userId: String!) {user(id: $userId) {userName}}',
    variables: { userId },
  }),
}).then(response => response.json())

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
      login_hint: 'skymk1@gmail.com',
    })
  }

  const { user } = yield call(
    [firebaseAuth, firebaseAuth.signInWithPopup],
    authProvider
  )

  const userName = yield call(getUserName, user.uid);
  yield call(CurrentRelay.reset)
  localStorage.setItem('providerAuthEmail', user.email)

  if (!userName.data.user) {
    yield call(browserHistory.push, '/login')
    yield put(authActions.userNameNotAvail(user.displayName || 'Guest'))
    const userAdd = yield take(authActions.addUsername.getType())

    yield call(CurrentRelay.Store.commitUpdate, new CreateUserMutation({
      firebaseId: user.uid,
      userName: userAdd.payload.username,
      fullName: user.displayName,
      photoUrl: user.photoURL,
      emailAddress: user.email,
      password: userAdd.payload.password,
    }));

    return { user, userName: userAdd.payload.username }
  }

  return { user, userName: userName.data.user.userName }
}

function* signInWithEmailPassword({ payload: { email, password } }) {
  const authData = yield call(
    [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
    email,
    password
  );

  const userName = yield call(getUserName, authData.uid);
  if (userName.data.user) {
    yield call(CurrentRelay.reset)
    return { user: authData, userName: userName.data.user.userName }
  }

  throw new Error({ message: 'No username' })
}

function* signOut() {
  yield call([firebaseAuth, firebaseAuth.signOut]);
  yield call(browserHistory.push, '/login');
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

export const signInWithGithub = () => signIn({
  authProvider: new firebase.auth.GithubAuthProvider(),
});

export const signInWithGoogle = () => authActions.signIn.init({
  authProvider: new firebase.auth.GoogleAuthProvider(),
});
