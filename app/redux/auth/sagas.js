import { call, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist-immutable/constants';
import { bindOnlyRequestActions } from 'redux/utils';
import { authSignout, resetEnv } from 'relay/RelayEnvironment';
import { authActions } from './actions';

function* onRehydrate({ payload }) {
  if (!payload.auth) return;

  const user = payload.auth.get('user')
  if (user) {
    if (user.provider && user.provider === 'stackexchange') {
      yield call(
        resetEnv, 'stackexchange',
        JSON.stringify({
          token: user.accessToken,
          providerId: user.providerId,
        })
      );
    } else if (user.provider && user.provider.includes('firebase')) {
      yield call(
        resetEnv, 'firebase', user.token
      );
    } else {
      yield call(resetEnv);
    }
  }
}

export default function* authSagas() {
  yield [
    takeLatest(REHYDRATE, onRehydrate),
    ...bindOnlyRequestActions(authActions),
    ...bindOnlyRequestActions(authSignout),
  ]
}
