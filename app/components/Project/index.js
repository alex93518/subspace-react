import React, { PropTypes } from 'react';
import { Link } from 'react-router'
import Relay from 'react-relay';
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

const Project = ({
  viewer: {
    project: {
      name,
      goals,
      owner,
      isPublic,
      createdAt,
    },
  },
}) => (
  <Row>
    <h3>
      <Link to="/projects">{owner}</Link>
      /{name}
      <Glyphicon glyph={isPublic ? 'flash' : 'lock'} />
    </h3>
    <NavTabs config={getNavConfig(owner, name)} />
    <FilesCol md={12}>
      <Row>
        Goals: {goals}
      </Row>
      <Row>TODO: show files here</Row>
      <Row><Col>Contributors</Col></Row>
      <Row><Col>Live Users</Col></Row>
      <Row><Col>Created: {createdAt}</Col></Row>
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
        id
        project(owner: $owner, name: $name) {
          id
          name
          goals
          isPublic
          owner
          createdAt
        }
      }
    `,
  },
})

