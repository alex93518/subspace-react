import Relay from 'react-relay/classic'

export class UpsertDiagramModelMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { upsertDiagramModel }`
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
      fragment on UpsertDiagramModelPayload {
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
