import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { withRouter } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { compose, branch, mapProps, renderComponent } from 'recompose';
import Blob from 'components/shared/Project/Repository/Blob';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import MainGrid from 'components/shared/MainGrid';
import { matchRoute } from 'utils/routeMatcher';
import CommitStatus from './CommitStatus';
import FileStatus from './FileStatus';

const RowSty = styled(Row)`
  padding-top: 15px;
`;

const BlobContiner = ({ blobContainer, treeEntry, splat }) => (
  <MainGrid>
    <Col md={12}>
      <RowSty>
        <Col>
          <BranchSelect
            branchSelect={blobContainer}
            suffix={splat ? `blob/${splat}` : null}
          />
          <CommitStatus commitStatus={treeEntry} />
          <FileStatus fileStatus={treeEntry} />
          <Blob blob={treeEntry} />
        </Col>
      </RowSty>
    </Col>
  </MainGrid>
);

BlobContiner.propTypes = {
  blobContainer: PropTypes.object.isRequired,
  treeEntry: PropTypes.object.isRequired,
  splat: PropTypes.string,
};

export default compose(
  withRouter,
  withRelayFragment({
    blobContainer: graphql`
      fragment BlobContainer_blobContainer on Repository {
        ...BranchSelect_branchSelect
        ref(refName: $branchHead) @include(if: $isBlob) {
          target {
            ... on Commit {
              tree {
                entries(path: $splat) {
                  ...CommitStatus_commitStatus
                  ...FileStatus_fileStatus
                  ...Blob_blob
                }
              }
            }
          }
        }
      }
    `,
  }),
  branch(
    props => props.blobContainer.ref.target.tree.entries.length === 0,
    renderComponent(() => <div>File Not Found</div>)
  ),
  mapProps(({ blobContainer, location: { pathname } }) => ({
    blobContainer,
    treeEntry: blobContainer.ref.target.tree.entries[0],
    splat: matchRoute(pathname).params['0'] || null,
  }))
)(BlobContiner);
