import { fromJS } from 'immutable';
import { authActions } from './actions';

const AuthState = fromJS({
  showChooseUsername: false,
  authenticated: false,
  uid: null,
  user: null,
});

export default function authReducer(state = AuthState, { payload, type }) {
  switch (type) {
    case authActions.SIGN_IN_FULFILLED:
      return state
        .set('authenticated', true)
        .set('showChooseUsername', false)
        .set('uid', payload.uid)
        .set('user', payload);

    case authActions.SIGN_OUT_FULFILLED:
      return state
        .set('authenticated', false)
        .set('showChooseUsername', false)
        .set('uid', null)
        .set('user', null);

    case authActions.USERNAME_NOTAVAIL:
      return state
        .set('showChooseUsername', true);

    default:
      return state;
  }
}
