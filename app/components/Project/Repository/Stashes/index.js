import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import MainGrid from 'components/shared/MainGrid';
import StashListItem from './StashListItem';

const Stashes = ({
  stashes: { stashes: { edges } },
}) => (
  <MainGrid>
    <div>
      {
        edges && edges.map(({ node, node: { id } }) =>
          <StashListItem key={id} stashListItem={node} />
        )
      }
    </div>
  </MainGrid>
)

Stashes.propTypes = {
  stashes: PropTypes.object.isRequired,
}

export default createFragmentContainer(Stashes, {
  stashes: graphql`
    fragment Stashes_stashes on Repository {
      stashes(first: 99) @include(if: $isStashes){
        edges {
          node {
            id
            ...StashListItem_stashListItem
          }
        }
      }
    }
  `,
})
