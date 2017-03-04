import Relay from 'react-relay';

export default class CreateProjectMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { createProject }`;
  }

  getVariables() {
    return {
      name: this.props.projectName,
      goals: this.props.goals,
      isPublic: this.props.repoAccess !== 'private',
      owner: this.props.userId,
    };
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        project: this.props.project,
      },
    }];
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateProjectPayload @relay(pattern: true) {
        project
      }
    `;
  }
}
