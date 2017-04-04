import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const TreeContainer = ({ treeContainer, relay: { variables } }) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <BranchSelect
          {...variables}
          branchSelect={treeContainer}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        <Tree
          {...variables}
          tree={treeContainer.ref.target.tree}
        />
      </Col>
    </RowSty>
  </Col>
)

TreeContainer.propTypes = {
  relay: PropTypes.object.isRequired,
  treeContainer: PropTypes.object.isRequired,
}

export default Relay.createContainer(TreeContainer, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: null,
  },
  fragments: {
    treeContainer: vars => Relay.QL`
      fragment on Repository {
        ${BranchSelect.getFragment('branchSelect', vars)}
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              tree {
                ${Tree.getFragment('tree', vars)}
              }
            }
          }
        }
      }
    `,
  },
})
