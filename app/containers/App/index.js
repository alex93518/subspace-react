import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import Header from 'components/shared/Header';
import * as authActions from './actions';
import { makeSelectAuth } from './selectors';

const App = ({ auth, actions, children }) => {
  const { authenticated, user } = auth
  const displayName = authenticated ? auth.user.user.displayName : null;
  const userName = user ? auth.user.userName : null;

  return (
    <div>
      <Header
        authenticated={authenticated}
        displayName={displayName}
        userName={userName}
        signOut={actions.signOut}
      />
      <Grid>
        {React.cloneElement(children, { auth, authActions: actions })}
      </Grid>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.node,
  auth: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
}

export default connect(
  createStructuredSelector({
    auth: makeSelectAuth(),
  }),
  dispatch => ({
    actions: bindActionCreators(authActions, dispatch),
  })
)(App)
