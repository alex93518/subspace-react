import Relay from 'react-relay'

export class DeleteDiagramLinkMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { deleteDiagramLink }`
  }

  getVariables() {
    const { id, ...vars } = this.props
    return vars
  }

  getFatQuery() {
    return Relay.QL`
      fragment on DeleteDiagramLinkPayload {
        diagram {
          links
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
