import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import MainGrid from 'components/shared/MainGrid';
import Branch from './Branch';

const TableBranches = styled(Table)`
  margin-top: 20px;
  border: 1px solid rgba(27,31,35,0.15);
  padding: 8px 8px 0;
  border-radius: 3px;
  background-color: #fff;
`

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
