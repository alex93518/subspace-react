import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { matchRoute, matchRouteChild } from 'utils/routeMatcher';
import MainContainer from './MainContainer';
import TreeContainer from './TreeContainer';
import BlobContainer from './BlobContainer';
import Commits from './Commits';
import Commit from './Commit';
import Branches from './Branches';
import Stashes from './Stashes';
import Diagrams from './Diagrams';
import DiagramEditor from './DiagramEditor';

const Components = {
  MainContainer: (repository, props) =>
    <MainContainer {...props} mainContainer={repository} />,
  Tree: (repository, props) =>
    <TreeContainer {...props} treeContainer={repository} />,
  Blob: (repository, props) =>
    <BlobContainer {...props} blobContainer={repository} />,
  Commits: (repository, props) =>
    <Commits {...props} commits={repository} />,
  Commit: (repository, props) =>
    <Commit {...props} commit={repository} />,
  Branches: (repository, props) =>
    <Branches {...props} branches={repository} />,
  Stashes: (repository, props) =>
    <Stashes {...props} stashes={repository} />,
  Diagrams: (repository, props) =>
    <Diagrams {...props} diagrams={repository} />,
  DiagramEditor: (repository, props) =>
    <DiagramEditor {...props} diagramEditor={repository} />,
}

const Repository = ({
  repository,
  relay,
}) => (
  <div>
    {matchRouteChild(relay.route, Components, repository)}
  </div>
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
    splat: null,
    commitId: null,
    diagramId: null,
  },
  fragments: {
    repository: vars => Relay.QL`
      fragment on Repository {
        ${route => matchRoute(route, {
          MainContainer: () => MainContainer.getFragment('mainContainer', vars),
          Tree: () => TreeContainer.getFragment('treeContainer', vars),
          Blob: () => BlobContainer.getFragment('blobContainer', vars),
          Commits: () => Commits.getFragment('commits', vars),
          Commit: () => Commit.getFragment('commit', vars),
          Branches: () => Branches.getFragment('branches', vars),
          Stashes: () => Stashes.getFragment('stashes', vars),
          Diagrams: () => Diagrams.getFragment('diagrams', vars),
          DiagramEditor: () => DiagramEditor.getFragment('diagramEditor', vars),
        })}
      }
    `,
  },
})
