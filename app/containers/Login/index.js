import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { authActions } from '../App/actions';
import makeSelectAuth from '../App/selectors';
import LoginWidget from '../../components/users/LoginWidget';

export class Login extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { authenticated, showChooseUsername } = this.props.auth;
    const { signInWithGoogle, signInWithGithub, signInWithEmailPassword } = this.props.actions;
    return (
      <div>
        <Helmet title="Login" meta={[{ name: 'description', content: 'Description of Login' }]} />
        <LoginWidget
          authenticated={authenticated}
          showChooseUsername={showChooseUsername}
          signInWithGoogle={signInWithGoogle}
          signInWithGithub={signInWithGithub}
          signInWithEmailPassword={signInWithEmailPassword}
        />
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(authActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
