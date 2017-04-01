import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const TreePage = ({ treePage, relay, projectPath }) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <BranchSelect
          branchSelect={treePage}
          projectPath={projectPath}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        <Tree
          tree={treePage.ref.target.tree}
          splat={relay.variables.splat}
          branchHead={relay.variables.branchHead}
          projectPath={projectPath}
        />
      </Col>
    </RowSty>
  </Col>
)

TreePage.propTypes = {
  relay: PropTypes.object.isRequired,
  projectPath: PropTypes.string.isRequired,
}

export default Relay.createContainer(TreePage, {
  initialVariables: {
    branchHead: 'master',
    splat: ''
  },
  fragments: {
    treePage: ({ branchHead, splat }) => Relay.QL`
      fragment on Repository {
        ${BranchSelect.getFragment('branchSelect')}
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              tree {
                ${Tree.getFragment('tree', { branchHead, splat })}
              }
            }
          }
        }
      }
    `,
  },
})
