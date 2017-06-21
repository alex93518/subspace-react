import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay'
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

const Branches = ({ edges, variables }) => (
  <MainGrid>
    <TableBranches>
      <tbody>
        {
          edges.map(({ node, node: { id } }) => (
            <tr key={id}>
              <Branch branch={node} {...variables} />
            </tr>
          ))
        }
      </tbody>
    </TableBranches>
  </MainGrid>
)

Branches.propTypes = {
  edges: PropTypes.array.isRequired,
  variables: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      userName: null,
      projectName: null,
    },
    fragments: {
      branches: vars => Relay.QL`
        fragment on Repository {
          refs(first: 99) {
            edges {
              node {
                id
                ${Branch.getFragment('branch', vars)}
              }
            }
          }
        }
      `,
    },
  }),
  mapProps(({
    branches: { refs: { edges } },
    relay: { variables },
  }) => ({ edges, variables }))
)(Branches)
