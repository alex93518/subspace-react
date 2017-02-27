import firebase from 'firebase';

export const authActions = {
  SIGN_IN: 'SIGN_IN',
  SIGN_IN_WITH_EMAIL_PASSWORD: 'SIGN_IN_WITH_EMAIL_PASSWORD',
  SIGN_IN_FAILED: 'SIGN_IN_FAILED',
  SIGN_IN_FULFILLED: 'SIGN_IN_FULFILLED',

  SIGN_OUT: 'SIGN_OUT',
  SIGN_OUT_FAILED: 'SIGN_OUT_FAILED',
  SIGN_OUT_FULFILLED: 'SIGN_OUT_FULFILLED',

  CREATE_USER_WITH_EMAIL_PASSWORD: 'CREATE_USER_WITH_EMAIL_PASSWORD',
  CREATE_USER_FAILED: 'CREATE_USER_FAILED',
  CREATE_USER_FULFILLED: 'CREATE_USER_FULFILLED',

  UPDATE_USER: 'UPDATE_USER',
  UPDATE_USER_FAILED: 'UPDATE_USER_FAILED',
  UPDATE_USER_FULFILLED: 'UPDATE_USER_FULFILLED',

  USERNAME_NOTAVAIL: 'USERNAME_NOTAVAIL',
  ADD_USERNAME: 'ADD_USERNAME',
  ADD_USERNAME_FAILED: 'ADD_USERNAME_FAILED',
  ADD_USERNAME_FULFILLED: 'ADD_USERNAME_FULFILLED',

  signIn: authProvider => ({
    type: authActions.SIGN_IN,
    payload: { authProvider },
  }),

  signInFailed: error => ({
    type: authActions.SIGN_IN_FAILED,
    payload: { error },
  }),

  signInFulfilled: authUser => ({
    type: authActions.SIGN_IN_FULFILLED,
    payload: { authUser },
  }),

  signInWithEmailPassword: (email, password) => ({
    type: authActions.SIGN_IN_WITH_EMAIL_PASSWORD,
    payload: { email, password },
  }),

  signInWithGithub: () => authActions.signIn(new firebase.auth.GithubAuthProvider()),

  signInWithGoogle: () => authActions.signIn(new firebase.auth.GoogleAuthProvider()),

  signInWithTwitter: () => authActions.signIn(new firebase.auth.TwitterAuthProvider()),

  signOut: () => ({
    type: authActions.SIGN_OUT,
  }),

  signOutFailed: error => ({
    type: authActions.SIGN_OUT_FAILED,
    payload: { error },
  }),

  signOutFulfilled: () => ({
    type: authActions.SIGN_OUT_FULFILLED,
  }),

  createUserWithEmailPassword: (username, email, password) => ({
    type: authActions.CREATE_USER_WITH_EMAIL_PASSWORD,
    payload: { username, email, password },
  }),

  createUserFailed: error => ({
    type: authActions.CREATE_USER_FAILED,
    payload: { error },
  }),

  createUserFulfilled: () => ({
    type: authActions.CREATE_USER_FULFILLED,
  }),

  updateUser: newProfile => ({
    type: authActions.UPDATE_USER,
    payload: { newProfile },
  }),

  updateUserFailed: error => ({
    type: authActions.UPDATE_USER_FAILED,
    payload: { error },
  }),

  updateUserFulfilled: authUser => ({
    type: authActions.UPDATE_USER_FULFILLED,
    payload: { authUser },
  }),

  userNameNotAvail: displayName => ({
    type: authActions.USERNAME_NOTAVAIL,
    payload: { displayName },
  }),

  addUsername: (username, password) => ({
    type: authActions.ADD_USERNAME,
    payload: { username, password },
  }),
};
