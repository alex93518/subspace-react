import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import StashHead from './Head';
import StashCommitStatus from './CommitStatus';
import StashComment from './StashComment';

const Stash = ({ stash, relay: { variables } }) => (
  <div>
    <StashHead stashHead={stash} {...variables} />
    <StashCommitStatus stashCommitStatus={stash.target} {...variables} />
    <StashComment stashComment={stash} {...variables} />
  </div>
)

Stash.propTypes = {
  stash: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Stash, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    stash: vars => Relay.QL`
      fragment on Ref {
        ${StashHead.getFragment('stashHead', vars)}
        ${StashComment.getFragment('stashComment', vars)}
        target {
          ... on Commit {
            ${StashCommitStatus.getFragment('stashCommitStatus', vars)}
          }
        }
      }
    `,
  },
})
