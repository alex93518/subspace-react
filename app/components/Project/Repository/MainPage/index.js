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

const MainPage = ({ mainPage, relay, projectPath }) => (
  <Col md={12}>
    <RowSty>
      <Col md={12}>
        <StatusBar
          statusBar={mainPage}
          branchHead={relay.variables.branchHead}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        <BranchSelect
          branchSelect={mainPage}
          projectPath={projectPath}
        />
      </Col>
    </RowSty>    
    <RowSty>
      <Col>
        <Tree
          tree={mainPage.ref.target.tree}
          splat={''}
          branchHead={relay.variables.branchHead}
          projectPath={projectPath}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        <Readme
          readme={mainPage.ref.target.tree}
        />
      </Col>
    </RowSty>
  </Col>
)

MainPage.propTypes = {
  relay: PropTypes.object.isRequired,
  projectPath: PropTypes.string.isRequired,
}

export default Relay.createContainer(MainPage, {
  initialVariables: {
    branchHead: 'master',
  },
  fragments: {
    mainPage: ({ branchHead }) => Relay.QL`
      fragment on Repository {
        ${BranchSelect.getFragment('branchSelect')}
        ${StatusBar.getFragment('statusBar', { branchHead })}
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              tree {
                ${Tree.getFragment('tree', { branchHead, splat: '' })}
                ${Readme.getFragment('readme')}
              }
            }
          }
        }
      }
    `,
  },
})
