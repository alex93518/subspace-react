import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const TreePage = ({ treePage, relay }) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <BranchSelect
          {...relay.variables}
          branchSelect={treePage}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        <Tree
          {...relay.variables}
          tree={treePage.ref.target.tree}
        />
      </Col>
    </RowSty>
  </Col>
)

TreePage.propTypes = {
  relay: PropTypes.object.isRequired,
  treePage: PropTypes.object.isRequired,
}

export default Relay.createContainer(TreePage, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: '',
  },
  fragments: {
    treePage: vars => Relay.QL`
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
