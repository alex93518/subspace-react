import { call, fork, put, take } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import { browserHistory } from 'react-router';
import { firebaseAuth } from '../../utils/firebase';
import { authActions } from './actions';

const getUserName = (userId) => fetch('http://localhost:9000/graphql', {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  method: 'POST',
  body: JSON.stringify({ query: 'query User($userId: String!) {user(id: $userId) {userName}}', variables: { userId } }),
}).then((response) => response.json())
.catch(() => null);

// Match firebaseId at the backend before insert (user can only create itself).
const insertUser = (firebaseId, userName, fullName, photoUrl, token) => fetch('http://localhost:9000/auth/graphql', {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    f_base: token,
  },
  method: 'POST',
  body: JSON.stringify({
    query: 'mutation CreateUser($firebaseId: String!, $userName: String!, $fullName: String!, $photoUrl: String!){ createUser(firebaseId: $firebaseId, userName: $userName, fullName: $fullName, photoUrl: $photoUrl) {userName}}',
    variables: { firebaseId, userName, fullName, photoUrl } }),
}).then((response) => response.json())
.catch(() => null);

function* signInWithEmailPassword(email, password) {
  try {
    const authData = yield call(
      [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
      email,
      password
    );
    const userName = yield call(getUserName, authData.uid);
    if (userName.data.user) {
      yield put(authActions.signInFulfilled({ user: authData, userName: userName.data.user.userName }));
    } else {
      yield put(authActions.signInFailed('No username'));
    }
  } catch (error) {
    yield put(authActions.signInFailed(error));
  }
}

function* signOut() {
  try {
    yield call([firebaseAuth, firebaseAuth.signOut]);
    yield put(authActions.signOutFulfilled());
    // yield Router.push('/login');
  } catch (error) {
    yield put(authActions.signOutFailed(error));
  }
}

function* createUserWithEmailPassword(username, email, password) {
  try {
    const authData = yield call(
      [firebaseAuth, firebaseAuth.createUserWithEmailAndPassword],
      email,
      password
    );
    yield call(insertUser, authData.uid, username, 'no null', 'no null', authData.Fd);
    yield put(authActions.signInFulfilled({ user: authData, userName: username }));
  } catch (error) {
    yield put(authActions.createUserFailed(error));
  }
}

//= ====================================
//  WATCHERS
//-------------------------------------

function* watchRehydrate() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(REHYDRATE);
    const auth = payload._root.entries.find((o) => o[0] === 'auth'); // eslint-disable-line no-underscore-dangle
    if (auth && auth[1].user) {
      yield put(authActions.signInFulfilled(auth[1].user));
    }
  }
}

function* watchSignIn() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(authActions.SIGN_IN);
    try {
      const authData = yield call([firebaseAuth, firebaseAuth.signInWithPopup], payload.authProvider);
      const userName = yield call(getUserName, authData.user.uid);
      if (!userName.data.user) {
        yield call(browserHistory.push, '/login');
        yield put(authActions.userNameNotAvail(authData.user.displayName));
        const userAdd = yield take(authActions.ADD_USERNAME);
        yield call(insertUser, authData.user.uid, userAdd.payload.username, authData.user.displayName, authData.user.photoURL, authData.user.Fd);
        yield put(authActions.signInFulfilled({ user: authData.user, userName: userAdd.payload.username }));
      } else {
        yield put(authActions.signInFulfilled({ user: authData.user, userName: userName.data.user.userName }));
      }
    } catch (error) {
      yield put(authActions.signInFailed(error));
    }
  }
}

function* watchSignInWithEmailPassword() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(authActions.SIGN_IN_WITH_EMAIL_PASSWORD);
    yield fork(signInWithEmailPassword, payload.email, payload.password);
  }
}

function* watchSignOut() {
  while (true) { // eslint-disable-line no-constant-condition
    yield take(authActions.SIGN_OUT);
    yield fork(signOut);
  }
}

function* watchCreateUserWithEmailPassword() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(authActions.CREATE_USER_WITH_EMAIL_PASSWORD);
    yield fork(createUserWithEmailPassword, payload.username, payload.email, payload.password);
  }
}

//= ====================================
//  AUTH SAGAS
//-------------------------------------

export default function* authSagas() {
  yield [
    fork(watchRehydrate),
    fork(watchSignIn),
    fork(watchSignInWithEmailPassword),
    fork(watchCreateUserWithEmailPassword),
    fork(watchSignOut),
  ];
}
