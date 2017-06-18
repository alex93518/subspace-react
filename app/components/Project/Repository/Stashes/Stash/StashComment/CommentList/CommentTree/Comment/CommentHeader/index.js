import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import { LinkUserName } from 'components/shared/Links';

const CommentHeader = ({ commentHeader }) => (
  <span>
    <LinkUserName user={commentHeader.owner} /> commented
    {` ${moment(commentHeader.createdAt).fromNow()}`}
  </span>
)

CommentHeader.propTypes = {
  commentHeader: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommentHeader, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    commentHeader: () => Relay.QL`
      fragment on StashComment {
        owner {
          ${LinkUserName.getFragment('user')}
        }
        createdAt
      }
    `,
  },
})
