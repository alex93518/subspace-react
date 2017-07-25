import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Col } from 'react-bootstrap';
import Tree from 'components/shared/Project/Repository/Tree';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import MainGrid from 'components/shared/MainGrid';
import { RowSty } from './styles';

const TreeContainer = ({
  treeContainer,
  treeContainer: {
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
            branchSelect={treeContainer}
          />
        </Col>
      </RowSty>
      <RowSty>
        <Col>
          <LastCommit
            lastCommit={edges[0].node}
          />
          <Tree
            tree={treeContainer.ref.target.tree}
          />
        </Col>
      </RowSty>
    </Col>
  </MainGrid>
)

TreeContainer.propTypes = {
  treeContainer: PropTypes.object.isRequired,
};

export default createFragmentContainer(TreeContainer, {
  treeContainer: graphql`
    fragment TreeContainer_treeContainer on Repository {
      ...BranchSelect_branchSelect
      ref(refName: $branchHead) @include(if: $isTree) {
        target {
          ... on Commit {
            treeHistory: history(first: 1) {
              edges {
                node {
                  ...LastCommit_lastCommit
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
  `,
})
