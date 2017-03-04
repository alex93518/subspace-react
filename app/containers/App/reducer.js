import { fromJS } from 'immutable';
import { createReducer } from 'redux-act';
import { signInFulfilled, signOutFulfilled, userNameNotAvail } from './actions';

const initAuthState = fromJS({
  showLoginStep: '',
  authenticated: false,
  user: null,
});

export default createReducer({
  [signInFulfilled]: (state, payload) => state
    .set('authenticated', true)
    .set('showLoginStep', '')
    .set('user', payload),
  [signOutFulfilled]: state => state
    .set('authenticated', false)
    .set('showLoginStep', '')
    .set('user', null),
  [userNameNotAvail]: (state, payload) => state
    .set('showLoginStep', payload),
}, initAuthState);
