import React, { PropTypes } from 'react';
import { Panel, Row, Col } from 'react-bootstrap';
import Relay from 'react-relay';

function Project({ project }) {
  return (
    <Panel>
      <Row>
        <Col md={9}>
          <Row>
            <Col>
              <span className="projectName">Project name: {project.name}</span>
            </Col>
          </Row>
          <Row>
            Goals: {project.goals}
          </Row>
          <Row>
            Owner: {project.owner} (TODO: Change to graphql UserType)
          </Row>
          <Row>
            Is Public Repo: {project.isPublic.toString()}
          </Row>
          <Row>
            Readme: (TODO: Read from repo file)
          </Row>
        </Col>
        <Col md={3} className="text-right">
          <Row><Col> Contributors</Col></Row>
          <Row><Col> Live Users</Col></Row>
          <Row><Col>Created: {project.createdAt}</Col></Row>
        </Col>
      </Row>
    </Panel>
  );
}

Project.propTypes = {
  project: PropTypes.object.isRequired,
};

export default Relay.createContainer(Project, {
  fragments: {
    project: () => Relay.QL`
      fragment on Project {
        id, name, goals, isPublic, owner, createdAt,
      }
    `,
  },
});
