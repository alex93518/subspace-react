import React, { PropTypes } from 'react';
import { Col, Button } from 'react-bootstrap';
import { authActions, signInWithGoogle } from 'containers/App/actions'
import EmailLoginForm from '../EmailLoginForm';
import LoginStep from '../LoginStep';

function LoginWidget({
  authenticated,
  showLoginStep,
  signInWithGithub,
}) {
  const login = authenticated ? <Col className="text-center"><h3>Signed in</h3></Col> : (
    <Col md={4} mdOffset={4} className="text-center">
      <div>
        <Button onClick={signInWithGoogle}>Sign in with Google</Button>
      </div>
      <div style={{ height: 5 }}></div>
      <div>
        <Button onClick={signInWithGithub}>Sign in with GitHub</Button>
      </div>
      <div style={{ height: 30 }}></div>
      <div>
        <EmailLoginForm onSubmit={authActions.signInWithEmailPassword.init} />
      </div>
    </Col>
  )

  return showLoginStep
    ? <LoginStep onSubmit={authActions.addUsername} username={showLoginStep} />
    : login
}

LoginWidget.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  showLoginStep: PropTypes.string,
  signInWithGithub: PropTypes.func.isRequired,
};

export default LoginWidget;
