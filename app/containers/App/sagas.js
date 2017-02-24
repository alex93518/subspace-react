import { call, fork, put, take } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import { firebaseAuth } from '../../utils/firebase';
import { authActions } from './actions';

function* signIn(authProvider) {
  try {
    const authData = yield call([firebaseAuth, firebaseAuth.signInWithPopup], authProvider);
    yield put(authActions.signInFulfilled(authData.user));
  } catch (error) {
    yield put(authActions.signInFailed(error));
  }
}

function* signInWithEmailPassword(email, password) {
  try {
    const authData = yield call(
      [firebaseAuth, firebaseAuth.signInWithEmailAndPassword],
      email,
      password
    );
    yield put(authActions.signInFulfilled(authData));
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
    yield put(authActions.signInFulfilled(authData));
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
    if (auth && auth[1].user && auth[1].user.authUser) {
      yield put(authActions.signInFulfilled(auth[1].user.authUser));
    }
  }
}

function* watchSignIn() {
  while (true) { // eslint-disable-line no-constant-condition
    const { payload } = yield take(authActions.SIGN_IN);
    yield fork(signIn, payload.authProvider);
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
