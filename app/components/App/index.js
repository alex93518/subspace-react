import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { makeSelectAuth } from 'redux/selectors';

const App = ({ auth, children }) => {
  const { authenticated, user } = auth
  const displayName = authenticated ? auth.user.displayName : null;
  const userName = user ? auth.userName : null;

  return (
    <div>
      <Header
        authenticated={authenticated}
        displayName={displayName}
        userName={userName}
      />
      {React.cloneElement(children, { auth })}
      <Footer />
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
