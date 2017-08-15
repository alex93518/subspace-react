import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
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

const BlobContiner = ({ repository, treeEntry, splat }) => (
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

BlobContiner.propTypes = {
  repository: PropTypes.object.isRequired,
  treeEntry: PropTypes.object.isRequired,
  splat: PropTypes.string,
};

export default compose(
  withRouter,
  withRelayFragment({
    repository: graphql`
      fragment BlobContainer_repository on Repository {
        ...BranchSelect_repository
        ref(refName: $branchHead) @include(if: $isBlob) {
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
    `,
  }),
  branch(
    props => props.repository.ref.target.tree.entries.length === 0,
    renderComponent(() => <div>File Not Found</div>)
  ),
  mapProps(({ repository, location: { pathname } }) => ({
    repository,
    treeEntry: repository.ref.target.tree.entries[0],
    splat: matchRoute(pathname).params['0'] || null,
  }))
)(BlobContiner);
