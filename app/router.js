import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { compose, withState, pure } from 'recompose'
import { ConnectedRouter } from 'react-router-redux'
import CurrentRelay from 'relay'
import Header from 'components/layout/Header'
import routes from 'components/routes'
import Footer from 'components/layout/Footer'
import { history } from './store'

const AuthWrapper = ({ storeLoaded, updateStoreStatus }) => {
  if (!storeLoaded) {
    CurrentRelay.reset(() => updateStoreStatus(true))
    return null
  }

  return (
    <ConnectedRouter history={history}>
      <div>
        <Header />
        <Switch>
          {
            routes.map(({ path, exact, component: RouteComponent, ...rest }, i) =>
              <Route
                key={i}
                path={path}
                exact={exact}
                render={props => <RouteComponent {...props} {...rest} />}
              />
            )
          }
        </Switch>
        <Footer />
      </div>
    </ConnectedRouter>
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

