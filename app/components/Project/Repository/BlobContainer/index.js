import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { createContainer } from 'recompose-relay'
import { compose, branch, mapProps, renderComponent } from 'recompose';
import Blob from 'components/shared/Project/Repository/Blob';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import MainGrid from 'components/shared/MainGrid';
import CommitStatus from './CommitStatus';
import FileStatus from './FileStatus';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const BlobContiner = ({ blobContainer, treeEntry, vars }) => (
  <MainGrid>
    <Col md={12}>
      <RowSty>
        <Col>
          <BranchSelect
            {...vars}
            branchSelect={blobContainer}
            suffix={`blob/${vars.splat}`}
          />
          <CommitStatus commitStatus={treeEntry} {...vars} />
          <FileStatus fileStatus={treeEntry} {...vars} />
          <Blob blob={treeEntry} />
        </Col>
      </RowSty>
    </Col>
  </MainGrid>
)

BlobContiner.propTypes = {
  blobContainer: PropTypes.object.isRequired,
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
          ${BranchSelect.getFragment('branchSelect', vars)}
          ref(refName: $branchHead) {
            target {
              ... on Commit {
                tree {
                  entries(path: $splat) {
                    ${CommitStatus.getFragment('commitStatus', vars)}
                    ${FileStatus.getFragment('fileStatus', vars)}
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
  branch(
    props => props.blobContainer.ref.target.tree.entries.length === 0,
    renderComponent(() => <div>File Not Found</div>)
  ),
  mapProps(({ blobContainer, relay }) => ({
    blobContainer,
    treeEntry: blobContainer.ref.target.tree.entries[0],
    vars: relay.variables,
  }))
)(BlobContiner)
