import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay';
import CurrentRelay, { AddStashCommentMutation } from 'relay';
import { compose, withHandlers } from 'recompose';
import styled from 'styled-components';
import Separator from 'components/shared/Separator';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const MainDiv = styled.div`
  margin-top: 10px;
`

const HeadSeparator = styled(Separator)`
  background: #ddd;
  margin-top: 0px;
`

const StashComment = ({
  stashComment: { stash, stash: { comments: { totalCount } } },
  submitComment,
  relay: { variables },
}) => (
  <MainDiv>
    <h4>Comments ({totalCount})</h4>
    <HeadSeparator />
    <CommentList commentList={stash} {...variables} />
    <CommentForm handleSubmit={submitComment} />
  </MainDiv>
)

StashComment.propTypes = {
  stashComment: PropTypes.object.isRequired,
  submitComment: PropTypes.func.isRequired,
  relay: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      stashComment: vars => Relay.QL`
        fragment on Ref {
          id
          rawId
          stash {
            ${CommentList.getFragment('commentList', vars)}
            rawId
            comments {
              totalCount
            }
          }
        }
      `,
    },
  }),
  withHandlers({
    submitComment: ({
      stashComment: { id, rawId, stash },
    }) => e => {
      e.preventDefault()
      const content = e.target.addComment.value
      if (content) {
        CurrentRelay.Store.commitUpdate(new AddStashCommentMutation({
          id,
          content,
          stashId: stash.rawId || null,
          stashRefId: rawId,
          parentId: null,
        }))
      }
    },
  }),
)(StashComment)
