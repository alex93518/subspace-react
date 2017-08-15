import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Description from './Description';
import Commits from './Commits';
import Comments from './Comments';
import Votes from './Votes';
import { PendingMainGrid } from './styles';

const PendingContribution = ({ pendingRef }) => (
  <MuiThemeProvider>
    <PendingMainGrid>
      <Description pendingRef={pendingRef}>
        <Commits commit={pendingRef.target} />
        <Comments stash={pendingRef.stash} />
        <Votes stash={pendingRef.stash} />
      </Description>
    </PendingMainGrid>
  </MuiThemeProvider>
)

PendingContribution.propTypes = {
  pendingRef: PropTypes.object.isRequired,
}

export default createFragmentContainer(PendingContribution, {
  pendingRef: graphql`
    fragment PendingContribution_pendingRef on Ref {
      ...Description_pendingRef
      stash {
        id
        ...Comments_stash
        ...Votes_stash
      }
      target {
        ... on Commit {
          ...Commits_commit
        }
      }
    }
  `,
})
