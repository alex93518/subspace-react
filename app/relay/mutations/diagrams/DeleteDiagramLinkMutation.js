import Relay from 'react-relay'

export class DeleteDiagramLinkMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { deleteDiagramLink }`
  }

  getVariables() {
    return this.props
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteDiagramLinkPayload @relay(pattern: true) {
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
