import Relay from 'react-relay/classic'
import { viewerId } from 'relay/constants'

export class CreateProjectMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { createRepository }`
  }

  getVariables() {
    return this.props.repository
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
        parentID: viewerId,
        connectionName: 'repositories',
        edgeName: 'repositoryEdge',
        rangeBehaviors: {
          '': 'append',
        },
      },
    ]
  }
}
