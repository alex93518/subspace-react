import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { createContainer } from 'recompose-relay'
import { compose, mapProps } from 'recompose';
import Blob from 'components/shared/Project/Repository/Blob';
import CommitStatus from './CommitStatus';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const BlobContiner = ({ treeEntry, vars }) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <CommitStatus commitStatus={treeEntry} {...vars} />
        <Blob blob={treeEntry} />
      </Col>
    </RowSty>
  </Col>
)

BlobContiner.propTypes = {
  treeEntry: PropTypes.object.isRequired,
  vars: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
      splat: null,
    },
    fragments: {
      blobContainer: vars => Relay.QL`
        fragment on Repository {
          ref(refName: $branchHead) {
            target {
              ... on Commit {
                tree {
                  entries(path: $splat) {
                    ${CommitStatus.getFragment('commitStatus', vars)}
                    ${Blob.getFragment('blob')}
                  }
                }
              }
            }
          }
        }
      `,
    },
  }),
  mapProps(({ blobContainer, relay }) => ({
    treeEntry: blobContainer.ref.target.tree.entries[0],
    vars: relay.variables,
  }))
)(BlobContiner)
