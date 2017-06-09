import Relay from 'react-relay/classic';

export class VoteStashMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { voteStash }`;
  }

  getVariables() {
    const {
      isVoteUp,
      stashId,
      stashRefId,
    } = this.props

    return {
      isVoteUp,
      stashId,
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
      fragment on voteStashPayload {
        ref
      }
    `;
  }
}
