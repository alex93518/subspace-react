import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import RepositoryQueryRenderer from 'relay/RepositoryQueryRenderer';
import { compose, mapProps } from 'recompose';
import MainGrid from 'components/shared/MainGrid';
import Branch from './Branch';
import { TableBranches } from './styles';

const Branches = ({ edges }) => (
  <MainGrid>
    <TableBranches>
      <tbody>
        {
          edges.map(({ node, node: { id } }) => (
            <tr key={id}>
              <Branch branchRef={node} />
            </tr>
          ))
        }
      </tbody>
    </TableBranches>
  </MainGrid>
)

Branches.propTypes = {
  edges: PropTypes.array.isRequired,
}

const ComposeBranches = compose(
  mapProps(({
    repository: { refs: { edges } },
  }) => ({ edges }))
)(Branches)

const BranchesQuery = ({ vars }) => (
  <RepositoryQueryRenderer vars={vars} query={query}>
    <ComposeBranches />
  </RepositoryQueryRenderer>
)

BranchesQuery.propTypes = {
  vars: PropTypes.object.isRequired,
};

const query = graphql`
  query BranchesQuery(
    $userName: String!, $projectName: String!,
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        refs(first: 99) {
          edges {
            node {
              id
              ...Branch_branchRef
            }
          }
        }
      }
    }
  }
`;

export default BranchesQuery;
