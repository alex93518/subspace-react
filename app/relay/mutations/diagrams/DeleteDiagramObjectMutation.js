import Relay from 'react-relay'

export class DeleteDiagramObjectMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { deleteDiagramObject }`
  }

  getVariables() {
    const { id, ...vars } = this.props
    return vars
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteDiagramObjectPayload {
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
