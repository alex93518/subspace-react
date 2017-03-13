import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import { Panel, Row, Col } from 'react-bootstrap';
import Relay from 'react-relay';

const Project = ({
  project: {
    name,
    goals,
    owner,
    isPublic,
    createdAt,
  },
}) => (
  <Panel>
    <Row>
      <Col md={9}>
        <Row>
          <Col>
            <Link to={`/${owner}/${name}`}>Project name: {name}</Link>
          </Col>
        </Row>
        <Row>
          Goals: {goals}
        </Row>
        <Row>
          Owner: {owner}
        </Row>
        <Row>
          Is Public Repo: {isPublic.toString()}
        </Row>
        <Row>
          Readme: (TODO: Read from repo file)
        </Row>
      </Col>
      <Col md={3} className="text-right">
        <Row><Col> Contributors</Col></Row>
        <Row><Col> Live Users</Col></Row>
        <Row><Col>Created: {createdAt}</Col></Row>
      </Col>
    </Row>
  </Panel>
)

Project.propTypes = {
  project: PropTypes.object.isRequired,
}

export default Relay.createContainer(Project, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id
        name
        goals
        isPublic
        owner
        createdAt
      }
    `,
  },
})
