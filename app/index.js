import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist-immutable';
import createMuiTheme from 'material-ui/styles/theme';
import createPalette from 'material-ui/styles/palette';
import { MuiThemeProvider } from 'material-ui/styles';
import injectTapEventPlugin from 'react-tap-event-plugin';
import 'sanitize.css/sanitize.css';
import blue from 'material-ui/colors/blue';
import orange from 'material-ui/colors/orange';

// Load the favicon, the manifest.json file and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./manifest.json';
import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import './global-styles';
import store from './store';
import AuthWrapper from './authWrapper'

injectTapEventPlugin();
const theme = createMuiTheme({
  palette: createPalette({
    primary: blue,
    accent: orange,
    type: 'light',
  }),
});

const render = () => {
  ReactDOM.render(
    <Provider store={store} persistor={persistor}>
      <MuiThemeProvider theme={theme}>
        <AuthWrapper />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
  )
}

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const persistor = persistStore(store, { blacklist: ['form'] }, render)

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('offline-plugin/runtime').install()
}
