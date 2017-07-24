import { call, take } from 'redux-saga/effects';
import { firebaseApp, firebaseAuth } from 'utils/firebase';
import { actionsGenerator, redirect } from 'redux/utils';
import { createUserMutation } from 'relay';
import { resetEnv } from 'relay/RelayEnvironment';
import {
  createUserWithEmailPassword, signIn, signInWithEmailPassword,
  addFirebaseProvider,
} from './firebase'
import {
  signInWithStackexchangeFn, addStackexchangeProviderFn,
} from './stackexchange'

export function* getNameAndCreateUser(user) {
  yield call(redirect, '/login')
  authActions.userNameNotAvail(user.displayName || 'Guest')
  const { payload } = yield take(authActions.addUsername.getType())
  const mutationVariables = {
    ...user,
    accessToken: user.accessToken || null,
    userName: payload.userName,
    password: payload.password,
  };
  yield call(createUserMutation, mutationVariables);

  return payload.userName;
}

function* signOut() {
  yield call(redirect, '/login')
  yield call([firebaseAuth, firebaseAuth.signOut])
  yield call(resetEnv);
}

export const authActions = actionsGenerator({
  createUserWithEmailPassword,
  signIn,
  signInWithEmailPassword,
  signOut,
  addUsername: null,
  userNameNotAvail: null,
  signInWithStackexchangeFn,
  addFirebaseProvider,
  addStackexchangeProviderFn,
})

export const signInWithGithub = () => authActions.signIn.init({
  authProvider: new firebaseApp.auth.GithubAuthProvider(),
  getNameAndCreateUser,
});

export const addGithubProvider = (id, userId, callback) =>
  authActions.addFirebaseProvider.init({
    id,
    userId,
    authProvider: new firebaseApp.auth.GithubAuthProvider(),
    callback,
  });

export const signInWithGoogle = () => authActions.signIn.init({
  authProvider: new firebaseApp.auth.GoogleAuthProvider(),
  getNameAndCreateUser,
});

export const addGoogleProvider = (id, userId, callback) =>
  authActions.addFirebaseProvider.init({
    id,
    userId,
    authProvider: new firebaseApp.auth.GoogleAuthProvider(),
    callback,
  });

export const signInWithStackexchange = () =>
  authActions.signInWithStackexchangeFn.init({
    getNameAndCreateUser,
  });

export const addStackexchangeProvider = (id, userId, callback) =>
  authActions.addStackexchangeProviderFn.init({
    id,
    userId,
    callback,
  })
