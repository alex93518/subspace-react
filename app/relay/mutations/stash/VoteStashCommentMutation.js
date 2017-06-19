import Relay from 'react-relay/classic';

export class VoteStashCommentMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { voteStashComment }`;
  }

  getVariables() {
    const {
      isVoteUp,
      stashCommentId,
      stashRefId,
    } = this.props

    return {
      isVoteUp,
      stashCommentId,
      stashRefId,
    };
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          ref: this.props.id,
        },
      },
    ];
  }

  getFatQuery() {
    return Relay.QL`
      fragment on voteStashCommentPayload {
        ref
      }
    `;
  }
}
