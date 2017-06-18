import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import R from 'ramda';
import CommentTree from './CommentTree';

const DivComment = styled.div`
  margin-bottom: 10px;
  font-style: italic;
`

const createdAtSort = R.sortBy(R.path(['node', 'createdAt']))

const CommentList = ({
  commentList: { comments: { totalCount, edges } }, stashData,
}) => (
  totalCount === 0 ? <DivComment>Leave a comment</DivComment> :
  <div>
    {
      createdAtSort(edges).reverse().map(({ node }) => (
        <CommentTree
          key={node.id}
          commentTree={node}
          stashData={stashData}
        />
      ))
    }
  </div>
)

CommentList.propTypes = {
  commentList: PropTypes.object.isRequired,
  stashData: PropTypes.object.isRequired,
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
              ${CommentTree.getFragment('commentTree')}
              id
              createdAt
            }
          }
        }
      }
    `,
  },
})
