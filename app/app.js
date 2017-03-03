import 'babel-polyfill';
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import useRelay from 'react-router-relay';
import { persistStore } from 'redux-persist';
import { compose, withState } from 'recompose'
import { Provider, connect } from 'react-redux';
import { useScroll } from 'react-router-scroll';
import { applyRouterMiddleware, Router } from 'react-router';
import 'sanitize.css/sanitize.css';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import App from 'containers/App';
import CurrentRelay from 'relay';
import './global-styles';
import store, { history } from './store';
import createRoutes from './routes';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const persistor = persistStore(store)

const rootRoute = {
  component: App,
  childRoutes: createRoutes(store),
}

const AuthWrapper = ({ storeLoaded, updateStoreStatus }) => {
  if (!storeLoaded) {
    CurrentRelay.reset(() => updateStoreStatus(true))
  }

  return (
    <Router
      history={history}
      environment={CurrentRelay.Store}
      render={
        applyRouterMiddleware(useRelay, useScroll())
      }
      routes={rootRoute}
    />
  )
}

AuthWrapper.propTypes = {
  storeLoaded: PropTypes.bool,
  updateStoreStatus: PropTypes.func,
}

// Rerender Router with new Relay.Environment on auth change
const RouterWrapper = compose(
  connect(state => ({ loggedIn: state.getIn(['auth', 'authenticated']) })),
  withState('storeLoaded', 'updateStoreStatus', () => !CurrentRelay.Store),
)(AuthWrapper)

const render = () => {
  ReactDOM.render(
    <Provider store={store} persistor={persistor}>
      <RouterWrapper />
    </Provider>,
    document.getElementById('app')
  )
}

render()

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('offline-plugin/runtime').install()
}
