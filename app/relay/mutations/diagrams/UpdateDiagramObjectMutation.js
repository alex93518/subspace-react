import Relay from 'react-relay'

export class UpdateDiagramObjectMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { updateDiagramObject }`
  }

  getVariables() {
    return this.props
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateDiagramObjectPayload @relay(pattern: true) {
        diagramObjectMeta
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
