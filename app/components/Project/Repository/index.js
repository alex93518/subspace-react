import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import MainPage from './MainPage';
import TreePage from './TreePage';
import BlobPage from './BlobPage';

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
  MainPage: (repository, props) =>
    <MainPage {...props} mainPage={repository} />,
  TreePage: (repository, props) =>
    <TreePage {...props} treePage={repository} />,
  BlobPage: (repository, props) =>
    <BlobPage {...props} blobPage={repository} />,
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
    isMainPage: false,
    isTreePage: false,
    isBlobPage: false,
    isCommitsPage: false,
    splat: '',
  },
  fragments: {
    repository: vars => Relay.QL`
      fragment on Repository {
        ${route => matchRoute(route, {
          MainPage: () => MainPage.getFragment('mainPage', vars),
          TreePage: () => TreePage.getFragment('treePage', vars),
          BlobPage: () => BlobPage.getFragment('blobPage', vars),
        })}
      }
    `,
  },
})
