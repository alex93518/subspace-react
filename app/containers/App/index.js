import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import Relay from 'react-relay';
import Header from 'components/shared/Header';
import { authActions } from './actions';
import { makeSelectAuth } from './selectors';

const App = ({ auth, viewer, actions, children }) => {
  const { authenticated } = auth
  const displayName = authenticated ? auth.user.user.displayName : null;
  const userName = viewer.user ? viewer.user.userName : null;

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
  viewer: PropTypes.object.isRequired,
}

const AppRedux = connect(
  createStructuredSelector({
    auth: makeSelectAuth(),
  }),
  dispatch => ({
    actions: bindActionCreators(authActions, dispatch),
  })
)(App)

export default Relay.createContainer(
  AppRedux,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on ViewerQuery {
          user {
            userName
          },
        }
      `,
    },
  },
);
