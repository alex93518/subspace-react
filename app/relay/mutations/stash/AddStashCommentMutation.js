import Relay from 'react-relay/classic';

export class AddStashCommentMutation extends Relay.Mutation {
  getMutation() {
    return Relay.QL`mutation { addStashComment }`;
  }

  getVariables() {
    const {
      content,
      stashId,
      stashRefId,
      parentId,
    } = this.props

    return {
      content,
      stashId,
      stashRefId,
      parentId: parentId || null,
    };
  }

  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          ref: this.props.id,
        },
      },
    ];
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddStashCommentPayload {
        ref
      }
    `;
  }
}
