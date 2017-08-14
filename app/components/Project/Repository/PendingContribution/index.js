import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';

const PendingContribution = () => (
  <div>
    test
  </div>
)

PendingContribution.propTypes = {
  stash: PropTypes.object.isRequired,
}

export default createFragmentContainer(PendingContribution, {
  stash: graphql`
    fragment PendingContribution_stash on Repository {
      pendingRef: ref(refName: $stashNum) @include(if: $isStash)  {
        stash {
          id
        }
      }
    }
  `,
})
