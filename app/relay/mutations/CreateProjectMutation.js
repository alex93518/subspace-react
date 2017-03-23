import Relay from 'react-relay'

export class CreateProjectMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { createRepository }`
  }

  getVariables() {
    return this.props
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateRepositoryPayload @relay(pattern: true) {
        repositoryEdge
        viewer { repositories }
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'RANGE_ADD',
        parentName: 'viewer',
        parentID: this.props.owner,
        connectionName: 'repositories',
        edgeName: 'repositoryEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ]
  }
}
