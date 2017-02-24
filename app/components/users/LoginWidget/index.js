import React, { PropTypes } from 'react';
import { Grid, Row, Col, Button, FormControl } from 'react-bootstrap';
import EmailLoginForm from '../EmailLoginForm';
// import styled from 'styled-components';

function LoginWidget({ authenticated, showChooseUsername, signInWithGoogle, signInWithGithub, signInWithEmailPassword }) {
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
  return (<Grid>
    <Row>
      {showChooseUsername ? <Col md={4} mdOffset={4} className="text-center">
        <h3>One more step</h3>
        <form onSubmit={this.handleAddUsernameSubmit}>
          Choose username:
          <FormControl
            id="formControlsUsername"
            type="text"
            label="Username"
            placeholder="Enter username"
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
          <Button type="submit">
            Submit
          </Button>
        </form>
      </Col> : login}
    </Row>
  </Grid>
  );
}

LoginWidget.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  showChooseUsername: PropTypes.bool.isRequired,
  signInWithGoogle: PropTypes.func.isRequired,
  signInWithGithub: PropTypes.func.isRequired,
  signInWithEmailPassword: PropTypes.func.isRequired,
};

export default LoginWidget;
