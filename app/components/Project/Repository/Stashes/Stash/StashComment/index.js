import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay';
import CurrentRelay, { AddStashCommentMutation } from 'relay';
import { compose, withState, withHandlers } from 'recompose';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import ReactQuill from 'react-quill';
import ScrollableAnchor, { goToAnchor } from 'react-scrollable-anchor'
import Separator from 'components/shared/Separator';
import CommentList from './CommentList';

const MainDiv = styled.div`
  margin-top: 35px;
`

const HeadSeparator = styled(Separator)`
  background: #ddd;
  margin-top: 0px;
`

const DivAddComment = styled.div`
  text-align: right;
  margin-top: 10px;
`

const StashComment = ({
  stashComment, stashComment: { comments: { totalAllCount } },
  submitComment, content, handleContentChange,
  relay: { variables },
}) => (
  <MainDiv>
    <ScrollableAnchor id={'commentTop'}>
      <h4>Comments ({totalAllCount})</h4>
    </ScrollableAnchor>
    <HeadSeparator />
    <CommentList
      commentList={stashComment}
      {...variables}
    />
    <HeadSeparator />
    <h4>Leave a comment</h4>
    <ReactQuill
      value={content}
      onChange={handleContentChange}
    />
    <DivAddComment>
      <Button onClick={submitComment}>Comment</Button>
    </DivAddComment>
  </MainDiv>
)

StashComment.propTypes = {
  stashComment: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  handleContentChange: PropTypes.func.isRequired,
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
        fragment on Stash {
          ${CommentList.getFragment('commentList', vars)}
          id
          rawId
          comments {
            totalAllCount
          }
        }
      `,
    },
  }),
  withState('content', 'updateContent', ''),
  withHandlers({
    handleContentChange: props => value => {
      props.updateContent(value);
    },
    submitComment: ({
      stashComment: { id, rawId },
      content, updateContent,
    }) => () => {
      if (content) {
        CurrentRelay.Store.commitUpdate(
          new AddStashCommentMutation({
            id,
            content,
            stashId: rawId || null,
            parentId: null,
          }),
          {
            onSuccess: () => {
              updateContent('')
              goToAnchor('commentTop')
            },
            onFailure: transaction => console.log(transaction.getError()),
          }
        )
      }
    },
  })
)(StashComment)
