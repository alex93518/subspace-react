import Relay from 'react-relay/classic';

export class AddUserProviderMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { addUserProvider }`;
  }

  getVariables() {
    const {
      userId,
      provider,
      userName,
      providerId,
      firebaseId,
      accessToken,
    } = this.props

    return {
      userId,
      provider,
      userName,
      providerId: providerId || null,
      firebaseId: firebaseId || null,
      accessToken: accessToken || null,
    };
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          user: this.props.id,
        },
      },
    ];
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddUserProviderPayload {
        user
      }
    `;
  }
}
