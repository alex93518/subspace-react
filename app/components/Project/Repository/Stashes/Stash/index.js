import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { Row, Col } from 'react-bootstrap';
import StashHead from './Head';
import StashCommitStatus from './CommitStatus';
import StashComment from './StashComment';
import UserVoteList from './UserVoteList';

const Stash = ({ stash, relay: { variables } }) => (
  <Row>
    <Col md={10}>
      <StashHead stashHead={stash} {...variables} />
      <StashCommitStatus stashCommitStatus={stash.target} {...variables} />
      <StashComment stashComment={stash} {...variables} />
    </Col>
    <Col md={2}>
      <UserVoteList
        userVoteList={stash.stash.acceptVotes}
        title={'Accepted by'}
      />
      <UserVoteList
        userVoteList={stash.stash.rejectVotes}
        title={'Rejected by'}
      />
    </Col>
  </Row>
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
        stash {
          acceptVotes (first: 9999) {
            ${UserVoteList.getFragment('userVoteList')}
          }
          rejectVotes (first: 9999) {
            ${UserVoteList.getFragment('userVoteList')}
          }
        }
        target {
          ... on Commit {
            ${StashCommitStatus.getFragment('stashCommitStatus', vars)}
          }
        }
      }
    `,
  },
})
