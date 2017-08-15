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
  repository, target, tree,
  createdAt, goals, description,
}) => (
  <MainGrid>
    <Col md={12}>
      {description &&
      <Row>
        <DescriptionCol md={12}>
          {description}
        </DescriptionCol>
      </Row>
      }
      <RowSty>
        <Col md={12}>
          <StatusBar
            repository={repository}
          />
        </Col>
      </RowSty>
      <RowSty>
        <Col md={6}>
          <BranchSelect
            repository={repository}
          />
        </Col>
        <CloneCol md={6}>
          <CloneUrlBox repository={repository} />
        </CloneCol>
      </RowSty>
      <RowSty>
        <Col>
          <LastCommit commit={target} />
          <Tree tree={tree} />
        </Col>
      </RowSty>
      <Row>
        <Col>
          <Readme tree={tree} />
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
  repository: PropTypes.object.isRequired,
  target: PropTypes.object.isRequired,
  tree: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
  goals: PropTypes.string,
  description: PropTypes.string,
};

export default compose(
  withRelayFragment({
    repository: graphql`
      fragment MainContainer_repository on Repository {
        ...BranchSelect_repository
        ...StatusBar_repository
        ...CloneUrlBox_repository
        ...EmptyRepo_repository
        createdAt @include(if: $isMainContainer)
        project @include(if: $isMainContainer) {
          goals
          description
        }
        ref(refName: $branchHead) @include(if: $isMainContainer) {
          target {
            ... on Commit {
              ...LastCommit_commit
              tree {
                ...Tree_tree
                ...Readme_tree
              }
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    vars,
    repository,
    repository: { ref, project },
  }) => ({
    vars,
    repository,
    ...project,
    createdAt: repository.createdAt,
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
              <EmptyRepo emptyRepo={props.repository} />
            </Col>
          </Row>
        </Col>
      </MainGrid>
    ))
  ),
)(MainContainer)
