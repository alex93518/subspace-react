import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';
import MainGrid from 'components/shared/MainGrid';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import RepositoryQueryRenderer from 'relay/RepositoryQueryRenderer';
import Readme from './Readme';
import StatusBar from './StatusBar';
import EmptyRepo from './EmptyRepo';
import CloneUrlBox from './CloneUrlBox';
import { DescriptionCol, RowSty, CloneCol } from './styles';

const MainContainerChild = ({ repository }) => (
  <MainGrid>
    {(repository && repository.ref && repository.ref.target) ?
      <Col md={12}>
        {repository.project.description &&
        <Row>
          <DescriptionCol md={12}>
            {repository.project.description}
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
            <LastCommit commit={repository.ref.target} />
            <Tree tree={repository.ref.target.tree} />
          </Col>
        </RowSty>
        <Row>
          <Col>
            <Readme tree={repository.ref.target.tree} />
          </Col>
        </Row>
        <RowSty>
          <Col>
            <div>Goals: {repository.project.goals}</div>
            <div>Created: {moment(repository.createdAt).format('MMMM Do YYYY')}</div>
          </Col>
        </RowSty>
      </Col> :
      <Col md={12}>
        <Row>
          <Col>
            <EmptyRepo emptyRepo={repository} />
          </Col>
        </Row>
      </Col>
    }
  </MainGrid>
)

MainContainerChild.propTypes = {
  repository: PropTypes.object,
};

const MainContainer = ({ vars }) => (
  <RepositoryQueryRenderer vars={vars} query={query}>
    <MainContainerChild />
  </RepositoryQueryRenderer>
)

MainContainer.propTypes = {
  vars: PropTypes.object.isRequired,
};

const query = graphql`
  query MainContainerQuery(
    $userName: String!, $projectName: String!,
    $branchHead: String!, $splat: String, $isStashes: Boolean!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        id
        ...BranchSelect_repository
        ...StatusBar_repository
        ...CloneUrlBox_repository
        ...EmptyRepo_repository
        createdAt
        project {
          goals
          description
        }
        ref(refName: $branchHead) {
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
    }
  }
`;

export default MainContainer;
