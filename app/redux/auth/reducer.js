import { fromJS } from 'immutable';
import { createReducer } from 'redux-act';
import { authActions } from './actions';

const initAuthState = fromJS({
  showLoginStep: '',
  authenticated: false,
  user: null,
});

const loginUser = (state, payload) => state
  .set('authenticated', true)
  .set('showLoginStep', '')
  .set('user', payload)

const logoutCurrentUser = state => state
  .set('authenticated', false)
  .set('showLoginStep', '')
  .set('user', null)

export default createReducer({
  [authActions.signIn.success]: loginUser,
  [authActions.signInWithEmailPassword.success]: loginUser,
  [authActions.createUserWithEmailPassword.success]: loginUser,

  [authActions.signIn.failure]: logoutCurrentUser,
  [authActions.signOut.success]: logoutCurrentUser,

  [authActions.userNameNotAvail]: (state, payload) => state
    .set('showLoginStep', payload),
}, initAuthState);
