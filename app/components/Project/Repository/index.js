import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import MainContainer from './MainContainer';
import TreeContainer from './TreeContainer';
import BlobContainer from './BlobContainer';
import Commits from './Commits';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const routeName = route =>
  route.name.replace('_aggregated__', '').replace('__default_viewer', '')

const matchRoute = (route, map) =>
  map[routeName(route)] ? map[routeName(route)]() : null;

const matchRouteChild = (route, map, repository) =>
  map[routeName(route)] ?
    map[routeName(route)](repository, route.params) : null;

const Components = {
  MainContainer: (repository, props) =>
    <MainContainer {...props} mainContainer={repository} />,
  Tree: (repository, props) =>
    <TreeContainer {...props} treeContainer={repository} />,
  Blob: (repository, props) =>
    <BlobContainer {...props} blobContainer={repository} />,
  Commits: (repository, props) =>
    <Commits {...props} commits={repository} />,
}

const Repository = ({
  repository,
  relay,
}) => (
  <Col md={12}>
    <RowSty>
      <Col>
        {matchRouteChild(relay.route, Components, repository)}
      </Col>
    </RowSty>
  </Col>
)

Repository.propTypes = {
  repository: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Repository, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: '',
  },
  fragments: {
    repository: vars => Relay.QL`
      fragment on Repository {
        ${route => matchRoute(route, {
          MainContainer: () => MainContainer.getFragment('mainContainer', vars),
          Tree: () => TreeContainer.getFragment('treeContainer', vars),
          Blob: () => BlobContainer.getFragment('blobContainer', vars),
          Commits: () => Commits.getFragment('commits', vars),
        })}
      }
    `,
  },
})
