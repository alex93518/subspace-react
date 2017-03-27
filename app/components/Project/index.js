import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import Relay from 'react-relay';
import moment from 'moment'
import styled from 'styled-components'
import { Row, Col, Glyphicon } from 'react-bootstrap';
import NavTabs from 'components/shared/NavTabs';

const getNavConfig = (owner, name) => [
  {
    link: `/${owner}/${name}/commits`,
    label: 'Commits',
  },
  {
    link: '/projects',
    label: 'Projects',
  },
]

const FilesCol = styled(Col)`
  padding-top: 15px;
`
const AccessIcon = styled(Glyphicon)`
  display: inline-block;
  margin-left: 10px;
  opacity: 0.6;
  font-size: 14px;
`

const Project = ({
  viewer: {
    repository: {
      name,
      owner,
      createdAt,
      isPrivate,

      project: {
        goals,
        description,
      },
    },
  },
}) => (
  <Row>
    <h3>
      <Link to="/projects">{owner.userName}</Link>
      /{name}
      <AccessIcon glyph={isPrivate ? 'flash' : 'lock'} />
    </h3>
    <NavTabs config={getNavConfig(owner.userName, name)} />
    <FilesCol md={12}>
      <Row>
        Goals: {goals}
      </Row>
      <Row>
        Description: {description}
      </Row>
      <Row>TODO: show files here</Row>
      <Row><Col>Contributors</Col></Row>
      <Row><Col>Live Users</Col></Row>
      <Row><Col>Created: {moment(createdAt).format('MMMM Do YYYY')}</Col></Row>
    </FilesCol>
    <FilesCol md={12}>
      <Row>
        TODO: show README from repo file
      </Row>
    </FilesCol>
  </Row>
)

Project.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default Relay.createContainer(Project, {
  initialVariables: {
    owner: null,
    name: null,
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        repository(owner: $owner, name: $name) {
          name
          owner {
            userName
          }
          createdAt
          isPrivate
          project {
            goals
            description
          }
        }
      }
    `,
  },
})

