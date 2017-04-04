import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import Readme from './Readme';
import StatusBar from './StatusBar';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const MainContainer = ({ mainContainer, relay: { variables } }) => (
  mainContainer.ref ?
    <Col md={12}>
      <RowSty>
        <Col md={12}>
          <StatusBar
            {...variables}
            statusBar={mainContainer}
          />
        </Col>
      </RowSty>
      <RowSty>
        <Col>
          <BranchSelect
            {...variables}
            branchSelect={mainContainer}
          />
        </Col>
      </RowSty>
      <RowSty>
        <Col>
          <Tree
            {...variables}
            tree={mainContainer.ref.target.tree}
          />
        </Col>
      </RowSty>
      <RowSty>
        <Col>
          <Readme
            readme={mainContainer.ref.target.tree}
          />
        </Col>
      </RowSty>
    </Col> :
    <div>Empty Repository</div>
)

MainContainer.propTypes = {
  mainContainer: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(MainContainer, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: null,
  },
  fragments: {
    mainContainer: vars => Relay.QL`
      fragment on Repository {
        ${BranchSelect.getFragment('branchSelect', vars)}
        ${StatusBar.getFragment('statusBar', vars)}
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              tree {
                ${Tree.getFragment('tree', vars)}
                ${Readme.getFragment('readme')}
              }
            }
          }
        }
      }
    `,
  },
})
