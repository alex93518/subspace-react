import Relay from 'react-relay/classic';

export class CreateUserMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { createUser }`;
  }

  getVariables() {
    const {
      firebaseId,
      userName,
      fullName,
      photoUrl,
      emailAddress,
      password,
    } = this.props

    return {
      firebaseId,
      userName,
      fullName: fullName || null,
      photoUrl: photoUrl || null,
      emailAddress: emailAddress || null,
      password,
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
