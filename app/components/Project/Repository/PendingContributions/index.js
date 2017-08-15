import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import MainGrid from 'components/shared/MainGrid';
import PendingContribution from './PendingContribution';

const Stashes = ({
  repository: { stashes: { edges } },
}) => (
  <MainGrid>
    <div>
      {
        edges && edges.map(({ node, node: { id } }) =>
          <PendingContribution key={id} pendingRef={node} />
        )
      }
    </div>
  </MainGrid>
)

Stashes.propTypes = {
  repository: PropTypes.object.isRequired,
}

export default createFragmentContainer(Stashes, {
  repository: graphql`
    fragment PendingContributions_repository on Repository {
      stashes(first: 99) @include(if: $isStashes){
        edges {
          node {
            id
            ...PendingContribution_pendingRef
          }
        }
      }
    }
  `,
})
