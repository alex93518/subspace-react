import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { compose, mapProps, branch, renderComponent } from 'recompose';
import MainGrid from 'components/shared/MainGrid';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import Readme from './Readme';
import StatusBar from './StatusBar';
import EmptyRepo from './EmptyRepo';
import CloneUrlBox from './CloneUrlBox';
import { DescriptionCol, RowSty, CloneCol } from './styles';

const MainContainer = ({
  mainContainer, target, tree,
  createdAt, goals, description,
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
            statusBar={mainContainer}
          />
        </Col>
      </RowSty>
      <RowSty>
        <Col md={6}>
          <BranchSelect
            branchSelect={mainContainer}
          />
        </Col>
        <CloneCol md={6}>
          <CloneUrlBox cloneUrlBox={mainContainer} />
        </CloneCol>
      </RowSty>
      <RowSty>
        <Col>
          <LastCommit lastCommit={target} />
          <Tree tree={tree} />
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
};

export default compose(
  withRelayFragment({
    mainContainer: graphql`
      fragment MainContainer_mainContainer on Repository {
        ...BranchSelect_branchSelect
        ...StatusBar_statusBar
        ...CloneUrlBox_cloneUrlBox
        ...EmptyRepo_emptyRepo
        createdAt @include(if: $isMainContainer)
        project @include(if: $isMainContainer) {
          goals
          description
        }
        ref(refName: $branchHead) @include(if: $isMainContainer) {
          target {
            ... on Commit {
              ...LastCommit_lastCommit
              tree {
                ...Tree_tree
                ...Readme_readme
              }
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    vars,
    mainContainer,
    mainContainer: { ref, project },
  }) => ({
    vars,
    mainContainer,
    ...project,
    createdAt: mainContainer.createdAt,
    target: ref ? ref.target : null,
    tree: ref ? ref.target.tree : null,
  })),
  branch(
    props => props.target === null,
    renderComponent(props => (
      <MainGrid>
        <Col md={12}>
          <Row>
            <Col>
              <EmptyRepo emptyRepo={props.mainContainer} />
            </Col>
          </Row>
        </Col>
      </MainGrid>
    ))
  ),
)(MainContainer)
