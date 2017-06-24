import Relay from 'react-relay/classic';

export class VoteStashMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { voteStash }`;
  }

  getVariables() {
    const {
      isVoteUp,
      stashId,
    } = this.props

    return {
      isVoteUp,
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
      fragment on voteStashPayload {
        stash
      }
    `;
  }
}
