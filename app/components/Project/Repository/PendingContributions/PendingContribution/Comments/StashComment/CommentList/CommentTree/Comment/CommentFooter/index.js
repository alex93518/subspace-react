import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { Button } from 'react-bootstrap';
import { compose, withState, withHandlers } from 'recompose';
import { scroller } from 'react-scroll';
import ReactQuill from 'react-quill';
import { addStashCommentMutation, voteStashCommentMutation } from 'relay';
import {
  ButtonReply, ReplyIcon, PanelReply, DivSubmitReply,
  VoteUpIcon, VoteDownIcon, SpanVotePoint,
} from './styles'

const CommentFooter = ({
  isShowReply, isReply, handleReplyClick,
  content, handleTextChange, submitReply,
  onVote, isVotedUp, isVotedDown,
  stashComment: { totalUpVotePoints, totalDownVotePoints },
}) => (
  <span>
    {
      isShowReply &&
      <ButtonReply bsSize="xsmall" onClick={handleReplyClick}>
        <ReplyIcon /> Reply
      </ButtonReply>
    }
    <VoteUpIcon onClick={() => onVote(true)} data-isVotedUp={isVotedUp} />
    <SpanVotePoint>{totalUpVotePoints || 0}</SpanVotePoint>
    <VoteDownIcon
      onClick={() => onVote(false)}
      data-isVotedDown={isVotedDown}
    />
    <SpanVotePoint>{totalDownVotePoints || 0}</SpanVotePoint>
    {
      isShowReply &&
      <PanelReply collapsible expanded={isReply}>
        <ReactQuill value={content} onChange={handleTextChange} />
        <DivSubmitReply>
          <Button bsSize="small" onClick={submitReply}>Reply</Button>
        </DivSubmitReply>
      </PanelReply>
    }
  </span>
)

CommentFooter.propTypes = {
  isShowReply: PropTypes.bool.isRequired,
  isReply: PropTypes.bool.isRequired,
  handleReplyClick: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  handleTextChange: PropTypes.func.isRequired,
  submitReply: PropTypes.func.isRequired,
  onVote: PropTypes.func.isRequired,
  isVotedUp: PropTypes.bool.isRequired,
  isVotedDown: PropTypes.bool.isRequired,
  stashComment: PropTypes.object.isRequired,
}

export default compose(
  withRelayFragment({
    stashComment: graphql`
      fragment CommentFooter_stashComment on StashComment {
        rawId
        stashId
        isUserVoted
        totalUpVotePoints
        totalDownVotePoints
      }
    `,
  }),
  withState('isReply', 'updateIsReply', false),
  withState('content', 'updateContent', ''),
  withState(
    'isVotedUp', 'updateIsVotedUp',
    props => !!props.stashComment.isUserVoted
  ),
  withState(
    'isVotedDown', 'updateIsVotedDown',
    props => (
      props.stashComment.isUserVoted == null ?
        false : !props.stashComment.isUserVoted
    )
  ),
  withHandlers({
    toggleVote: props => isVoteUp => {
      if (
        isVoteUp === null ||
        (isVoteUp && isVoteUp === props.isVotedUp) ||
        (!isVoteUp && !isVoteUp === props.isVotedDown)
      ) {
        props.updateIsVotedUp(false)
        props.updateIsVotedDown(false)
      } else if (isVoteUp) {
        props.updateIsVotedUp(true)
        props.updateIsVotedDown(false)
      } else {
        props.updateIsVotedUp(false)
        props.updateIsVotedDown(true)
      }
    },
  }),
  withHandlers({
    handleReplyClick: props => () => {
      props.updateIsReply(!props.isReply)
    },
    handleTextChange: props => value => {
      props.updateContent(value)
    },
    submitReply: ({
      stashGlobalId, content, updateContent, updateIsReply,
      parentId, stashComment: { stashId },
    }) => () => {
      if (content) {
        addStashCommentMutation({
          id: stashGlobalId,
          content,
          stashId,
          parentId,
          sort: 'popular',
          onCompleted: resp => {
            if (resp.addStashComment.clientMutationId) {
              updateIsReply(false)
              updateContent('')
              scroller.scrollTo(
                `stashComment-anchor-${resp.addStashComment.clientMutationId}`
              )
            }
          },
        });
      }
    },
    onVote: props => isVoteUp => {
      const voteVar = typeof (isVoteUp) === 'boolean' ? isVoteUp : null;
      props.toggleVote(voteVar)
      voteStashCommentMutation({
        id: props.stashGlobalId,
        isVoteUp,
        stashCommentId: props.stashComment.rawId || null,
        stashId: props.stashComment.stashId,
      })
    },
  })
)(CommentFooter)
