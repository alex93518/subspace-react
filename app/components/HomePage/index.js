import React, { PropTypes } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { signInWithGoogle, signInWithGithub } from 'redux/auth/actions'
import EmailSignupForm from 'components/Login/EmailSignupForm';
import MainGrid from 'components/shared/MainGrid';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { authenticated, showLoginStep } = this.props.auth;

    return (
      <MainGrid>
        <Row>
          <Col md={8}>
            <h1>Collaborative social coding.</h1>
            <h1>Stand on the shoulders of giants. </h1>
          </Col>
          {authenticated || showLoginStep ? null :
          <Col md={4}>
            <div className="text-center">
              <Button onClick={signInWithGoogle}>Sign up with Google</Button>
            </div>
            <div style={{ height: 5 }}></div>
            <div className="text-center">
              <Button onClick={signInWithGithub}>Sign up with GitHub</Button>
            </div>
            <div style={{ height: 30 }}></div>
            <div className="text-right">
              <EmailSignupForm />
            </div>
          </Col>}
        </Row>
      </MainGrid>
    );
  }
}

HomePage.propTypes = {
  auth: PropTypes.object,
};

export default HomePage;
