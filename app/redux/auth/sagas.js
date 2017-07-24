import { call, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import { bindOnlyRequestActions } from 'redux/utils';
import { resetEnv } from 'relay/RelayEnvironment';
import { authActions } from './actions';

function* onRehydrate({ payload }) {
  if (!payload._root) return; // eslint-disable-line

  // eslint-disable-next-line no-underscore-dangle
  const auth = payload._root.entries.find(o => o[0] === 'auth')
  if (auth && auth[1].authenticated) {
    if (auth[1].user.provider && auth[1].user.provider === 'stackexchange') {
      yield call(
        resetEnv, 'stackexchange',
        JSON.stringify({
          token: auth[1].user.accessToken,
          providerId: auth[1].user.providerId,
        })
      );
    } else if (auth[1].user.provider && auth[1].user.provider.includes('firebase')) {
      yield call(
        resetEnv, 'firebase', auth[1].user.token
      );
    } else {
      yield call(resetEnv);
    }

    authActions.signIn.success(auth[1]);
  }
}

export default function* authSagas() {
  yield [
    takeLatest(REHYDRATE, onRehydrate),
    ...bindOnlyRequestActions(authActions),
  ]
}
