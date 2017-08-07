import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import PendingStashItem from './PendingStashItem';

const PendingStashList = ({
  viewer: { pendingStashes: { edges } },
}) => (
  <div>
    {
      edges && edges.length > 0 &&
      <h3>Pending stashes</h3>
    }
    {
      edges && edges.map(({ node }) =>
        <PendingStashItem key={node.id} gitRef={node} />
      )
    }
  </div>
)

PendingStashList.propTypes = {
  viewer: PropTypes.object.isRequired,
}

export default createFragmentContainer(PendingStashList, {
  viewer: graphql`
    fragment PendingStashList_viewer on Viewer {
      pendingStashes: stashes(first: 99, isOnline: false){
        edges {
          node {
            id
            ...PendingStashItem_gitRef
          }
        }
      }
    }
  `,
})
