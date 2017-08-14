import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Description from './Description';
import Commits from './Commits';
import Comments from './Comments';
import Votes from './Votes';
import { PendingMainGrid } from './styles';

const PendingContribution = ({ pendingContribution: { pendingRef } }) => (
  <MuiThemeProvider>
    <PendingMainGrid>
      <Description pendingRef={pendingRef} />
      <Votes pendingRefStash={pendingRef.stash} />
      <Commits pendingCommits={pendingRef.target} />
      <Comments pendingRefStash={pendingRef.stash} />
    </PendingMainGrid>
  </MuiThemeProvider>
)

PendingContribution.propTypes = {
  pendingContribution: PropTypes.object.isRequired,
}

export default createFragmentContainer(PendingContribution, {
  pendingContribution: graphql`
    fragment PendingContribution_pendingContribution on Repository {
      pendingRef: ref(refName: $stashNum) @include(if: $isStash)  {
        ...Description_pendingRef
        stash {
          id
          ...Comments_pendingRefStash
          ...Votes_pendingRefStash
        }
        target {
          ... on Commit {
            ...Commits_pendingCommits
          }
        }
      }
    }
  `,
})
