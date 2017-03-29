import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router'
import Relay from 'react-relay';
import moment from 'moment'
import styled from 'styled-components'
import { Row, Col, Glyphicon } from 'react-bootstrap';
import NavTabs from 'components/shared/NavTabs';
import Repository from './Repository'

const getNavConfig = (owner, name) => [
  {
    link: `/${owner}/${name}`,
    label: 'Code',
  },
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

const handleOnRowClick = (
  isTree, pathName, branchName, relay
) => {
  let path = `/${relay.variables.userName}/${relay.variables.projectName}`
  if (branchName && pathName) {
    path += `/${branchName}/${isTree ? 'tree' : 'blob'}/${pathName}`
  }
  relay.setVariables({
    branchHead: branchName,
    path: pathName,
    isTree,
  })
  browserHistory.push(path)
}

const Project = ({
  viewer: {
    repository,
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
  relay,
}) => (
  <Row>
    <h3>
      <Link to="/projects">{owner.userName}</Link>
      /{name}
      <AccessIcon glyph={isPrivate ? 'flash' : 'lock'} />
    </h3>
    <NavTabs config={getNavConfig(owner.userName, name)} />
    <Repository
      repository={repository}
      branchHead={relay.variables.branchHead}
      isTree={relay.variables.isTree}
      path={relay.variables.path}
      onRowClick={(isTree, path, branchName) =>
        handleOnRowClick(
          isTree,
          path,
          branchName,
          relay
        )
      }
    />
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
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Project, {
  initialVariables: {
    userName: null,
    projectName: null,
    branchHead: 'master',
    treeName: null,
    fileName: null,
    isTree: true,
    path: '',
  },
  prepareVariables: vars => {
    if (vars.treeName !== null) {
      return { ...vars, path: vars.treeName, isTree: true }
    } else if (vars.fileName !== null) {
      return { ...vars, path: vars.fileName, isTree: false }
    }
    return vars
  },
  fragments: {
    viewer: ({ branchHead, isTree, path }) => Relay.QL`
      fragment on Viewer {
        repository(owner: $userName, name: $projectName) {
          ${Repository.getFragment('repository', { branchHead, isTree, path })}
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
