import { call, takeLatest } from 'redux-saga/effects'

const wrapRequestFn = (requestFn, statusActions) =>
  function* requestWrapper(payload) {
    try {
      const res = yield call(requestFn, payload, statusActions)
      statusActions.success(res)
    } catch (err) {
      console.error(err) // eslint-disable-line
      statusActions.failure(err)
    }
  }

export function bindFetcher({ requestFn, init, ...statusActions }) {
  const fetch = wrapRequestFn(requestFn, statusActions)
  return takeLatest(init.getType(), fetch)
}

export function bindOnlyRequestActions(actions) {
  return Object.values(actions)
    .filter(action => action.requestFn).map(bindFetcher)
}
