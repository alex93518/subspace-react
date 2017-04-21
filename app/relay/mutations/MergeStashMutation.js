import Relay from 'react-relay'

export class MergeStashMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { mergeStash }`
  }

  getVariables() {
    return this.props
  }

  getFatQuery() {
    return Relay.QL`
      fragment on MergeStashPayload @relay(pattern: true) {
        stashes
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
