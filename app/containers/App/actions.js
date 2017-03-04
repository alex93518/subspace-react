import firebase from 'firebase';
import { createAction } from 'redux-act';

export const [
  signIn,
  signInFailed,
  signInFulfilled,
  signInWithEmailPassword,

  signOut,
  signOutFailed,
  signOutFulfilled,

  createUserWithEmailPassword,
  createUserFailed,
  createUserFulfilled,

  userNameNotAvail,
  addUsername,
] = [
  'SIGN_IN',
  'SIGN_IN_FAILED',
  'SIGN_IN_FULFILLED',
  'SIGN_IN_WITH_EMAIL_PASSWORD',

  'SIGN_OUT',
  'SIGN_OUT_FAILED',
  'SIGN_OUT_FULFILLED',

  'CREATE_USER_WITH_EMAIL_PASSWORD',
  'CREATE_USER_FAILED',
  'CREATE_USER_FULFILLED',

  'USERNAME_NOTAVAIL',
  'ADD_USERNAME',
].map(createAction)

export const signInWithGithub = () => signIn({
  authProvider: new firebase.auth.GithubAuthProvider(),
});
export const signInWithGoogle = () => signIn({
  authProvider: new firebase.auth.GoogleAuthProvider(),
});
