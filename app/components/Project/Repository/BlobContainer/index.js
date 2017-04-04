import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import Blob from 'components/shared/Project/Repository/Blob';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const BlobContiner = ({ blobContainer, relay: { variables } }) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <Blob
          blob={blobContainer.ref.target.tree}
          splat={variables.splat}
        />
      </Col>
    </RowSty>
  </Col>
)

BlobContiner.propTypes = {
  relay: PropTypes.object.isRequired,
  blobContainer: PropTypes.object.isRequired,
}

export default Relay.createContainer(BlobContiner, {
  initialVariables: {
    branchHead: 'master',
    splat: null,
  },
  fragments: {
    blobContainer: ({ splat }) => Relay.QL`
      fragment on Repository {
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              tree {
                ${Blob.getFragment('blob', { splat })}
              }
            }
          }
        }
      }
    `,
  },
})
