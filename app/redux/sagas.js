import { fork } from 'redux-saga/effects'
import authSagas from 'redux/auth/sagas';

export default function* rootSaga() {
  yield [
    fork(authSagas),
  ]
}
