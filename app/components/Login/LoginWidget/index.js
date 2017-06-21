import React from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-bootstrap';
import { authActions } from 'redux/auth/actions';
import { makeSelectAuth } from 'redux/selectors';
import { injectSelectors } from 'redux/utils';
import SocialLogin from 'components/shared/SocialLogin';
import Separator from 'components/shared/Separator';
import EmailLoginForm from '../EmailLoginForm';
import LoginStep from '../LoginStep';

const LoginWidget = ({
  auth: {
    authenticated,
    showLoginStep,
  },
}) => {
  if (showLoginStep) {
    return (
      <LoginStep
        username={showLoginStep}
        onSubmit={authActions.addUsername}
      />
    )
  }

  if (authenticated) {
    return <Col className="text-center"><h3>Signed in</h3></Col>
  }

  return (
    <Col md={4} mdOffset={4} className="text-center">
      <SocialLogin pretext={'Sign in with '} />
      <Separator />
      <div>
        <h5>Or sign in with email address</h5>
        <EmailLoginForm onSubmit={authActions.signInWithEmailPassword.init} />
      </div>
    </Col>
  )
}

LoginWidget.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default injectSelectors({
  auth: makeSelectAuth(),
})(LoginWidget)
