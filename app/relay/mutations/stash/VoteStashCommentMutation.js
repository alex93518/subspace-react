import Relay from 'react-relay/classic';

export class VoteStashCommentMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { voteStashComment }`;
  }

  getVariables() {
    const {
      isVoteUp,
      stashCommentId,
      stashId,
    } = this.props

    return {
      isVoteUp,
      stashCommentId,
      stashId,
    };
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          stash: this.props.id,
        },
      },
    ];
  }

  getFatQuery() {
    return Relay.QL`
      fragment on voteStashCommentPayload {
        stash
      }
    `;
  }
}
