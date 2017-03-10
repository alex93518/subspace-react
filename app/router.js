import React, { PropTypes } from 'react';
import useRelay from 'react-router-relay';
import { compose, withState, pure } from 'recompose'
import { connect } from 'react-redux';
import { useScroll } from 'react-router-scroll';
import { applyRouterMiddleware, Router } from 'react-router';
import CurrentRelay from 'relay';
import routes from 'components/routes';
import App from 'components/App';
import { history } from './store';

const rootRoute = {
  component: App,
  childRoutes: routes,
}

const AuthWrapper = ({ storeLoaded, updateStoreStatus }) => {
  if (!storeLoaded) {
    CurrentRelay.reset(() => updateStoreStatus(true))
    return null
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
export default compose(
  connect(state => ({
    loggedIn: state.getIn(['auth', 'authenticated']),
  })),
  withState('storeLoaded', 'updateStoreStatus', () => !!CurrentRelay.Store),
  pure,
)(AuthWrapper)

