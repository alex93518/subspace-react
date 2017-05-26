import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import { makeSelectAuth } from 'redux/selectors';
import { injectSelectors } from 'redux/utils'
import SocialLogin from 'components/shared/SocialLogin';
import EmailSignupForm from 'components/Login/EmailSignupForm';
import MainGrid from 'components/shared/MainGrid';
import Separator from 'components/shared/Separator';

const HomePage = ({
  auth: {
    authenticated,
    showLoginStep,
  },
}) => (
  <MainGrid>
    <Row>
      <Col md={8}>
        <h1>Collaborative social coding.</h1>
        <h1>Stand on the shoulders of giants. </h1>
      </Col>
      {
        !(authenticated || showLoginStep) &&
        <Col md={4} className="text-center">
          <SocialLogin pretext={'Sign up with '} />
          <Separator />
          <h5>Or sign up with email address</h5>
          <div className="text-right">
            <EmailSignupForm />
          </div>
        </Col>
      }
    </Row>
  </MainGrid>
)

HomePage.propTypes = {
  auth: PropTypes.object,
};

export default injectSelectors({
  auth: makeSelectAuth(),
})(HomePage)
