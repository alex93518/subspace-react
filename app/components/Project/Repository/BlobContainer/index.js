import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import RepositoryQueryRenderer from 'relay/RepositoryQueryRenderer';
import { withRouter } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import { compose, branch, mapProps, renderComponent } from 'recompose';
import Blob from 'components/shared/Project/Repository/Blob';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import MainGrid from 'components/shared/MainGrid';
import { matchRoute } from 'utils/routeMatcher';
import CommitStatus from './CommitStatus';
import FileStatus from './FileStatus';
import { RowSty } from './styles';

const BlobContainer = ({ repository, treeEntry, splat }) => (
  <MainGrid>
    <Col md={12}>
      <RowSty>
        <Col>
          <BranchSelect
            repository={repository}
            suffix={splat ? `blob/${splat}` : null}
          />
          <CommitStatus treeEntry={treeEntry} />
          <FileStatus treeEntry={treeEntry} />
          <Blob treeEntry={treeEntry} />
        </Col>
      </RowSty>
    </Col>
  </MainGrid>
);

BlobContainer.propTypes = {
  repository: PropTypes.object,
  treeEntry: PropTypes.object.isRequired,
  splat: PropTypes.string,
};

const ComposeBlobContainer = compose(
  withRouter,
  branch(
    props => props.repository.ref.target.tree.entries.length === 0,
    renderComponent(() => <div>File Not Found</div>)
  ),
  mapProps(({ repository, location: { pathname } }) => ({
    repository,
    treeEntry: repository.ref.target.tree.entries[0],
    splat: matchRoute(pathname).params['0'] || null,
  }))
)(BlobContainer);

const BlobContainerQuery = ({ vars }) => (
  <RepositoryQueryRenderer vars={vars} query={query}>
    <ComposeBlobContainer />
  </RepositoryQueryRenderer>
)

BlobContainerQuery.propTypes = {
  vars: PropTypes.object.isRequired,
};

const query = graphql`
  query BlobContainerQuery(
    $userName: String!, $projectName: String!,
    $branchHead: String!, $splat: String, $isStashes: Boolean!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        ...BranchSelect_repository
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              tree {
                entries(path: $splat) {
                  ...CommitStatus_treeEntry
                  ...FileStatus_treeEntry
                  ...Blob_treeEntry
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default BlobContainerQuery;

