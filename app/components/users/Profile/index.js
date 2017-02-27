import React, { PropTypes } from 'react';
import { Panel, Row, Col } from 'react-bootstrap';

class Profile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user } = this.props;
    return (
      <div>
        <Row>
          <Col md={3}>
            <Panel className={'text-center'}>
              <img alt={user.fullName} src={user.photoUrl} width={120} height={120} style={{ marginBottom: 10 }} />
              <div>99 Karma</div>
              <div>99 Skill</div>
              <div>99 Reputation</div>
              <div>Badges</div>
            </Panel>
          </Col>
          <Col md={9}>
            <h2>{user.fullName}</h2>
            <h4>Hello World</h4>
            <div>Email: {user.email}</div>
            <div>Stackoverflow:</div>
            <div>Git: </div>
            <div>Linkedin: </div>
            <div>Twitter: </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3>Projects: TODO</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3>Contributions: TODO</h3>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h3>Client Feedbacks: TODO</h3>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
