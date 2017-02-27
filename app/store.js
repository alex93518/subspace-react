import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { dispatchRef } from 'redux/utils'
import createReducer from './reducers';
import { makeSelectLocationState } from './containers/App/selectors';
import authSagas from './containers/App/sagas';

const sagaMiddleware = createSagaMiddleware();
const initialState = {}
const context = {}

// Create the store with two middlewares
// 1. sagaMiddleware: Makes redux-sagas work
// 2. routerMiddleware: Syncs the location/URL path to the state
const middlewares = [
  sagaMiddleware,
  routerMiddleware(history),
];

const enhancers = [
  applyMiddleware(...middlewares),
];

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;
/* eslint-enable */

const store = createStore(
  createReducer(),
  fromJS(initialState),
  composeEnhancers(...enhancers)
);

// Extensions
sagaMiddleware.run(authSagas, context);
store.runSaga = sagaMiddleware.run;
store.asyncReducers = {}; // Async reducer registry

// Assign real dispatch for autobinded actions
dispatchRef.dispatch = store.dispatch

// Make reducers hot reloadable, see http://mxs.is/googmo
/* istanbul ignore next */
if (module.hot) {
  module.hot.accept('./reducers', () => {
    import('./reducers').then(reducerModule => {
      const createReducers = reducerModule.default;
      const nextReducers = createReducers(store.asyncReducers);

      store.replaceReducer(nextReducers);
    });
  });
}

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
export const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: makeSelectLocationState(),
});

export default store
