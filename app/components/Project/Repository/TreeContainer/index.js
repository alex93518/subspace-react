import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import RepositoryQueryRenderer from 'relay/RepositoryQueryRenderer';
import { Col } from 'react-bootstrap';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import MainGrid from 'components/shared/MainGrid';
import { RowSty } from './styles';

const TreeContainer = ({
  repository,
  repository: {
    ref: {
      target: { treeHistory: { edges } },
    },
  },
}) => (
  <MainGrid>
    <Col md={12}>
      <RowSty>
        <Col>
          <BranchSelect
            repository={repository}
          />
        </Col>
      </RowSty>
      <RowSty>
        <Col>
          <LastCommit
            commit={edges[0].node}
          />
          <Tree
            tree={repository.ref.target.tree}
          />
        </Col>
      </RowSty>
    </Col>
  </MainGrid>
)

TreeContainer.propTypes = {
  repository: PropTypes.object,
};

const TreeContainerQuery = ({ vars }) => (
  <RepositoryQueryRenderer vars={vars} query={query}>
    <TreeContainer />
  </RepositoryQueryRenderer>
)

TreeContainerQuery.propTypes = {
  vars: PropTypes.object.isRequired,
};

const query = graphql`
  query TreeContainerQuery(
    $userName: String!, $projectName: String!,
    $branchHead: String!, $splat: String, $isStashes: Boolean!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
      ...BranchSelect_repository
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              treeHistory: history(first: 1) {
                edges {
                  node {
                    ...LastCommit_commit
                  }
                }
              }
              tree {
                ...Tree_tree
              }
            }
          }
        }
      }
    }
  }
`;

export default TreeContainerQuery;
