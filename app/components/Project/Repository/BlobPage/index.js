import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import Blob from 'components/shared/Project/Repository/Blob';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const BlobPage = ({ blobPage, relay }) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <Blob
          blob={blobPage.ref.target.tree}
          splat={relay.variables.splat}
        />
      </Col>
    </RowSty>
  </Col>
)

BlobPage.propTypes = {
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(BlobPage, {
  initialVariables: {
    branchHead: '',
    splat: ''
  },
  fragments: {
    blobPage: ({ branchHead, splat }) => Relay.QL`
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
