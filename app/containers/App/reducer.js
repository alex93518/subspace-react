import { fromJS } from 'immutable';
import { authActions } from './actions';

const AuthState = fromJS({
  showLoginStep: '',
  authenticated: false,
  user: null,
});

export default function authReducer(state = AuthState, { payload, type }) {
  switch (type) {
    case authActions.SIGN_IN_FULFILLED:
      return state
        .set('authenticated', true)
        .set('showLoginStep', '')
        .set('user', payload.authUser);

    case authActions.SIGN_OUT_FULFILLED:
      return state
        .set('authenticated', false)
        .set('showLoginStep', '')
        .set('user', null);

    case authActions.USERNAME_NOTAVAIL:
      return state
        .set('showLoginStep', payload.displayName);

    default:
      return state;
  }
}
