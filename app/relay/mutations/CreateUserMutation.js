import Relay from 'react-relay';

export default class CreateUserMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { createUser }`;
  }

  getVariables() {
    return {
      firebaseId: this.props.firebaseId,
      userName: this.props.userName,
      fullName: this.props.fullName,
      photoUrl: this.props.photoUrl,
      emailAddress: this.props.emailAddress,
      password: this.props.password,
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
