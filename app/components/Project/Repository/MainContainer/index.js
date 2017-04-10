import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col, OverlayTrigger, Button, Glyphicon, Popover } from 'react-bootstrap';
import styled from 'styled-components';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import Readme from './Readme';
import StatusBar from './StatusBar';
import EmptyRepo from './EmptyRepo';
import CloneUrlBox from './CloneUrlBox';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const CloneCol = styled(Col)`
  text-align: right;
  padding-right: 0px;
`

const CloneButton = styled(Button)`
  font-size: 12px;
  color: #fff;
  background-color: #28a745;
  background-image: linear-gradient(-180deg, #34d058 0%, #28a745 90%);
  1px solid rgba(27,31,35,0.2);
  padding: 5px 10px;
  margin-top: 5px;
  border: none;
`

const MainContainer = ({
  mainContainer,
  mainContainer: { ref, url },
  relay: { variables },
}) => (
  ref ?
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
        <Col md={6}>
          <BranchSelect
            {...variables}
            branchSelect={mainContainer}
          />
        </Col>
        <CloneCol md={6}>
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Popover id="popover-positioned-bottom">
                {url}
              </Popover>
            }
          >
            <CloneButton>
              Clone or download
              {' '}
              <Glyphicon glyph="triangle-bottom" />
            </CloneButton>
          </OverlayTrigger>
        </CloneCol>
      </RowSty>
      <RowSty>
        <Col md={12}>
          <LastCommit lastCommit={ref.target} {...variables} />
        </Col>
      </RowSty>
      <RowSty>
        <Col>
          <Tree tree={ref.target.tree} {...variables} />
        </Col>
      </RowSty>
      <RowSty>
        <Col>
          <Readme readme={ref.target.tree} />
        </Col>
      </RowSty>
    </Col> :
    <EmptyRepo emptyRepo={mainContainer} />
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
        ${EmptyRepo.getFragment('emptyRepo')}
        ${CloneUrlBox.getFragment('cloneUrlBox')}
        url
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              ${LastCommit.getFragment('lastCommit', vars)}
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
