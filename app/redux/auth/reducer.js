import { fromJS } from 'immutable';
import { createReducer } from 'redux-act';
import { authRelay } from 'relay/RelayEnvironment';
import { authActions } from './actions';

const initAuthState = fromJS({
  showLoginStep: '',
  authenticated: false,
  userName: undefined,
  user: null,
});

const loginUser = (state, { user, userName, isInvisible }) => state
  .set('authenticated', true)
  .set('showLoginStep', '')
  .set('userName', userName)
  .set('isInvisible', isInvisible)
  .set('user', user)

const logoutCurrentUser = state => state
  .set('authenticated', false)
  .set('showLoginStep', '')
  .set('userName', undefined)
  .set('isInvisible', null)
  .set('user', null)

export default createReducer({
  [authActions.signIn.success]: loginUser,
  [authActions.signInWithEmailPassword.success]: loginUser,
  [authActions.signInWithStackexchangeFn.success]: loginUser,
  [authActions.createUserWithEmailPassword.success]: loginUser,

  [authActions.signIn.failure]: logoutCurrentUser,
  [authActions.signInWithEmailPassword.failure]: logoutCurrentUser,
  [authActions.signInWithStackexchangeFn.failure]: logoutCurrentUser,
  [authRelay.signOut.success]: logoutCurrentUser,

  [authActions.userNameNotAvail]: (state, payload) =>
    state.set('showLoginStep', payload),
  [authRelay.setIsInvisible.success]: (state, payload) =>
    state.set('isInvisible', payload),
}, initAuthState);
