import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const TreeContainer = ({ treeContainer, relay }) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <BranchSelect
          {...relay.variables}
          branchSelect={treeContainer}
          currentBranch={relay.variables.branchHead}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        <Tree
          {...relay.variables}
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
    splat: '',
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
