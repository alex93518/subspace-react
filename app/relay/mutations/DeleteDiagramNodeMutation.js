import Relay from 'react-relay'

export class DeleteDiagramNodeMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { deleteDiagramObject }`
  }

  getVariables() {
    return this.props
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteDiagramObjectPayload @relay(pattern: true) {
        clientMutationId
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
        },
      },
    ]
  }
}
