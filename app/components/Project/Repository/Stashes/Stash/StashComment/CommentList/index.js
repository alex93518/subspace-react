import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import R from 'ramda';
import Comment from './Comment';

const createdAtSort = R.sortBy(R.path(['node', 'createdAt']))

const CommentList = ({
  commentList: { comments: { totalCount, edges } },
}) => (
  totalCount === 0 ? null :
  <div>
    {
      createdAtSort(edges).map(({ node }) => (
        <Comment key={node.id} comment={node} />
      ))
    }
  </div>
)

CommentList.propTypes = {
  commentList: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommentList, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    commentList: () => Relay.QL`
      fragment on Stash {
        comments(first: 50) {
          totalCount
          edges {
            node {
              ${Comment.getFragment('comment')}
              id
              createdAt
            }
          }
        }
      }
    `,
  },
})
