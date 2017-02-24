import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Button } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import { authActions } from '../App/actions';
import makeSelectAuth from '../App/selectors';

class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { authenticated } = this.props.auth;
    const { signInWithGoogle, signInWithGithub } = this.props.actions;
    return (
      <Row>
        <Col md={8}>
          <h1>Collaborative social coding.</h1>
          <h1>Stand on the shoulders of giants. </h1>
        </Col>
        {authenticated ? null :
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
          </div>
        </Col>}
      </Row>
    );
  }
}

HomePage.propTypes = {
  auth: PropTypes.object,
  actions: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(authActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
