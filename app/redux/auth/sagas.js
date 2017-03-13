import { takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import { bindOnlyRequestActions } from 'redux/utils'
import { authActions } from './actions';

function* onRehydrate({ payload }) {
  // eslint-disable-next-line no-underscore-dangle
  if (!payload._root) return

  // eslint-disable-next-line no-underscore-dangle
  const auth = payload._root.entries.find(o => o[0] === 'auth')
  if (auth && auth[1].authenticated) {
    authActions.signIn.success(auth[1])
  }
}

export default function* authSagas() {
  yield [
    takeLatest(REHYDRATE, onRehydrate),
    ...bindOnlyRequestActions(authActions),
  ]
}
