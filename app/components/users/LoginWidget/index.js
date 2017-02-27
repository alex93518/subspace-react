import React, { PropTypes } from 'react';
import { Col, Button } from 'react-bootstrap';
import EmailLoginForm from '../EmailLoginForm';
import LoginStep from '../LoginStep';
// import styled from 'styled-components';

function LoginWidget({ authenticated, showLoginStep, signInWithGoogle, signInWithGithub, signInWithEmailPassword, addUsername }) {
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
        <EmailLoginForm onSubmit={(email, password) => signInWithEmailPassword(email, password)} />
      </div>
    </Col>
  );
  return showLoginStep ? <LoginStep onSubmit={addUsername} username={showLoginStep} /> : login;
}

LoginWidget.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  showLoginStep: PropTypes.string,
  signInWithGoogle: PropTypes.func.isRequired,
  signInWithGithub: PropTypes.func.isRequired,
  signInWithEmailPassword: PropTypes.func.isRequired,
  addUsername: PropTypes.func.isRequired,
};

export default LoginWidget;
