import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import moment from 'moment'
import { Panel, Row, Col } from 'react-bootstrap';
import Relay from 'react-relay';

const Project = ({
  project: {
    name,
    isPrivate,
    createdAt,
    owner,
    project: {
      goals,
      description,
      topics: {
        edges: topics,
      },
    },
  },
}) => (
  <Panel>
    <Row>
      <Col md={9}>
        <Row>
          <Col>
            <Link to={`/${owner.userName}/${name}`}>Project name: {name}</Link>
          </Col>
        </Row>
        <Row>
          Topics: {topics.map(({ node: { value } }) => (
            <span key={value}>{value} </span>
          ))}
        </Row>
        <Row>
          Goals: {goals}
        </Row>
        <Row>
          Owner: {owner.userName}
        </Row>
        <Row>
          Description: {description}
        </Row>
        <Row>
          Is Public Repo: {isPrivate.toString()}
        </Row>
        <Row>
          Readme: (TODO: Read from repo file)
        </Row>
      </Col>
      <Col md={3} className="text-right">
        <Row><Col> Contributors</Col></Row>
        <Row><Col> Live Users</Col></Row>
        <Row><Col>Created: {moment(createdAt).format('MMMM Do YYYY')}</Col></Row>
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
      fragment on Repository {
        id
        name
        isPrivate
        createdAt
        owner {
          userName
        }
        project {
          goals
          description
          topics(first: 10) {
            edges {
              node {
                value
              }
            }
          }
        }
      }
    `,
  },
})
