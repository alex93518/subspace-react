import Relay from 'react-relay'

export class UpdateDiagramLinkMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { updateDiagramLink }`
  }

  getVariables() {
    return this.props
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpdateDiagramLinkPayload @relay(pattern: true) {
        diagramLinkMeta
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
