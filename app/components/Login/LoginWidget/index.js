import React, { PropTypes } from 'react';
import { Col, Button } from 'react-bootstrap';
import {
  authActions,
  signInWithGithub,
  signInWithGoogle,
} from 'redux/auth/actions'
import { makeSelectAuth } from 'redux/selectors';
import { injectSelectors } from 'redux/utils'
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
      <div>
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      </div>
      <div style={{ height: 5 }}></div>
      <div>
        <Button onClick={signInWithGithub}>Sign in with GitHub</Button>
      </div>
      <div style={{ height: 5 }}></div>
      <div>
        <Button onClick={authActions.signInWithStackexchange.init}>
          Sign in with Stackoverflow
        </Button>
      </div>
      <div style={{ height: 30 }}></div>
      <div>
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
