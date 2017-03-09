import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Grid } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import Header from 'components/shared/Header';
import { makeSelectAuth } from 'redux/selectors';

const App = ({ auth, children }) => {
  const { authenticated, user } = auth
  const displayName = authenticated ? auth.user.user.displayName : null;
  const userName = user ? auth.user.userName : null;

  return (
    <div>
      <Header
        authenticated={authenticated}
        displayName={displayName}
        userName={userName}
      />
      <Grid>
        {React.cloneElement(children, { auth })}
      </Grid>
    </div>
  )
}

App.propTypes = {
  children: PropTypes.node,
  auth: PropTypes.object.isRequired,
}

export default connect(
  createStructuredSelector({
    auth: makeSelectAuth(),
  }),
)(App)
