import Relay from 'react-relay'

export class UpsertDiagramMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { upsertDiagram }`
  }

  getVariables() {
    const { repositoryId, repositoryRawId, ...vars } = this.props
    return {
      repositoryId: repositoryRawId,
      ...vars,
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpsertDiagramPayload {
        repository {
          diagrams
        }
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          repository: this.props.repositoryId,
        },
      },
    ]
  }
}
