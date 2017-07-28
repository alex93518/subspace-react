import { path } from 'ramda'
import { createStore, applyMiddleware, compose } from 'redux'
import { fromJS } from 'immutable'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'
import { dispatchRef } from 'redux/utils'
import createReducer from 'redux/reducer'
import rootSaga from 'redux/sagas'
import { autoRehydrate } from 'redux-persist-immutable'

export const history = createHistory()
const sagaMiddleware = createSagaMiddleware()
const initialState = {}
const context = {}

const middlewares = [
  sagaMiddleware,
  routerMiddleware(history),
  () => next => reduxAction => {
    // remove synthetic events from the payload
    if (path(['payload', 'nativeEvent'], reduxAction)) {
      reduxAction.payload = undefined // eslint-disable-line no-param-reassign
    }

    next(reduxAction)
  },
]

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/* eslint-enable */

const store = createStore(
  createReducer(),
  fromJS(initialState),
  composeEnhancers(
    applyMiddleware(...middlewares),
    autoRehydrate()
  )
)

// Extensions
sagaMiddleware.run(rootSaga, context)
store.runSaga = sagaMiddleware.run
store.asyncReducers = {} // Async reducer registry

// Assign real dispatch for autobinded actions
dispatchRef.dispatch = store.dispatch

// Make reducers hot reloadable, see http://mxs.is/googmo
/* istanbul ignore next */
if (module.hot) {
  module.hot.accept('redux/reducer', () => {
    import('redux/reducer').then(reducerModule => {
      const createReducers = reducerModule.default
      const nextReducers = createReducers(store.asyncReducers)

      store.replaceReducer(nextReducers)
    })
  })
}

export default store
