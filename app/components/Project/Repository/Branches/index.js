import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
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
              <Branch branch={node} />
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

export default compose(
  withRelayFragment({
    branches: graphql`
      fragment Branches_branches on Repository {
        refs(first: 99) @include(if: $isBranches) {
          edges {
            node {
              id
              ...Branch_branch
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    branches: { refs: { edges } },
  }) => ({ edges }))
)(Branches)
