import { call, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import { bindOnlyRequestActions } from 'redux/utils'
import CurrentRelay from 'relay';
import { authActions } from './actions';

function* onRehydrate({ payload }) {
  // eslint-disable-next-line no-underscore-dangle
  if (!payload._root) return

  // eslint-disable-next-line no-underscore-dangle
  const auth = payload._root.entries.find(o => o[0] === 'auth')
  if (auth && auth[1].authenticated) {
    // user logged in stackexchange -> open new browser -> reset relay connection.
    if (auth[1].user.provider && auth[1].user.provider === 'stackexchange') {
      yield call(
        CurrentRelay.reset, null, 'stackexchange',
        JSON.stringify({
          token: auth[1].user.accessToken,
          providerId: auth[1].user.providerId,
        })
      )
    } else {
      yield call(CurrentRelay.reset)
    }

    authActions.signIn.success(auth[1])
  }
}

export default function* authSagas() {
  yield [
    takeLatest(REHYDRATE, onRehydrate),
    ...bindOnlyRequestActions(authActions),
  ]
}
