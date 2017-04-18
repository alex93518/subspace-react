import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import moment from 'moment';
import { compose, mapProps, branch, renderComponent } from 'recompose';
import { createContainer } from 'recompose-relay'
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import MainGrid from 'components/shared/MainGrid';
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

const DescriptionCol = styled(Col)`
  font-size: 16px;
  margin-top: 5px;
  padding-left: 0px;
`

const MainContainer = ({
  mainContainer, target, tree, createdAt,
  goals, description, variables,
}) => (
  <MainGrid>
    <Col md={12}>
      <Row>
        <DescriptionCol md={12}>
          {description}
        </DescriptionCol>
      </Row>
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
          <CloneUrlBox cloneUrlBox={mainContainer} />
        </CloneCol>
      </RowSty>
      <RowSty>
        <Col>
          <LastCommit lastCommit={target} {...variables} />
          <Tree tree={tree} {...variables} />
        </Col>
      </RowSty>
      <Row>
        <Col>
          <Readme readme={tree} />
        </Col>
      </Row>
      <RowSty>
        <Col>
          <div>Goals: {goals}</div>
          <div>Created: {moment(createdAt).format('MMMM Do YYYY')}</div>
        </Col>
      </RowSty>
    </Col>
  </MainGrid>
)

MainContainer.propTypes = {
  mainContainer: PropTypes.object.isRequired,
  target: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
  goals: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  variables: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
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
          createdAt
          project {
            goals
            description
          }
        }
      `,
    },
  }),
  mapProps(({
    mainContainer,
    mainContainer: { ref, project },
    relay: { variables },
  }) => ({
    mainContainer,
    ...project,
    createdAt: mainContainer.createdAt,
    target: ref ? ref.target : null,
    tree: ref ? ref.target.tree : null,
    variables,
  })),
  branch(
    props => props.target === null,
    renderComponent(props => <EmptyRepo emptyRepo={props.mainContainer} />)
  ),
)(MainContainer)
