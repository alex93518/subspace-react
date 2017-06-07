import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';

const Comment = ({
  comment: { content, createdAt },
}) => (
  <div>
    {createdAt} : {content}
  </div>
)

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
}

export default Relay.createContainer(Comment, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    comment: () => Relay.QL`
      fragment on StashComment {
        id
        content
        createdAt
      }
    `,
  },
})
