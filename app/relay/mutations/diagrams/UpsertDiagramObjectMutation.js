import Relay from 'react-relay'

export class UpsertDiagramObjectMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { upsertDiagramObject }`
  }

  getVariables() {
    const { id, ...vars } = this.props
    return vars
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpsertDiagramObjectPayload {
        diagram {
          objects
        }
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          diagram: this.props.id,
        },
      },
    ]
  }
}
