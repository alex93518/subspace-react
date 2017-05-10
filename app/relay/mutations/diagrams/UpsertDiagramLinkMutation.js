import Relay from 'react-relay'

export class UpsertDiagramLinkMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { upsertDiagramLink }`
  }

  getVariables() {
    const { id, ...vars } = this.props
    return vars
  }

  getFatQuery() {
    return Relay.QL`
      fragment on UpsertDiagramLinkPayload {
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
