import Relay from 'react-relay/classic'

export class MergeStashMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { mergeStash }`
  }

  getVariables() {
    const {
      repositoryId,
      stashName,
    } = this.props

    return {
      repositoryId,
      stashName,
    };
  }

  getFatQuery() {
    return Relay.QL`
      fragment on MergeStashPayload {
        repository
      }
    `
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          repository: this.props.id,
        },
      },
    ]
  }
}
