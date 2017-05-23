import Relay from 'react-relay/classic';

export class CreateUserMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { createUser }`;
  }

  getVariables() {
    const {
      userId,
      userName,
      fullName,
      photoUrl,
      emailAddress,
      password,
      provider,
      accessToken,
    } = this.props

    return {
      userId,
      userName,
      fullName: fullName || null,
      photoUrl: photoUrl || null,
      emailAddress: emailAddress || null,
      password,
      provider,
      accessToken,
    };
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          user: this.props.user,
        },
      },
    ];
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateUserPayload @relay(pattern: true) {
        user
      }
    `;
  }
}
