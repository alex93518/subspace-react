import Relay from 'react-relay'

export class CreateProjectMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { createProject }`
  }

  getVariables() {
    return this.props
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateProjectPayload @relay(pattern: true) {
        projectEdge
        viewer { allProjects }
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'viewer',
        parentID: this.props.owner,
        connectionName: 'allProjects',
        edgeName: 'projectEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ]
  }
}
