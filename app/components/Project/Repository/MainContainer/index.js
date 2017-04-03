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

const MainContainer = ({ mainContainer, relay }) => (
  <Col md={12}>
    <RowSty>
      <Col md={12}>
        <StatusBar
          {...relay.variables}
          statusBar={mainContainer}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        <BranchSelect
          {...relay.variables}
          branchSelect={mainContainer}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        <Tree
          {...relay.variables}
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
  </Col>
)

MainContainer.propTypes = {
  relay: PropTypes.object.isRequired,
  mainContainer: PropTypes.object.isRequired,
}

export default Relay.createContainer(MainContainer, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: '',
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
