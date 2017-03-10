import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectAuth } from 'redux/selectors';
import LoginWidget from './LoginWidget';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { authenticated, showLoginStep } = this.props.auth;

    return (
      <div>
        <Helmet title="Login" meta={[{ name: 'description', content: 'Description of Login' }]} />
        <LoginWidget
          authenticated={authenticated}
          showLoginStep={showLoginStep}
        />
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

export default connect(mapStateToProps)(Login)
