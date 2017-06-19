import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { Button, Panel } from 'react-bootstrap';
import { compose, withState, withHandlers } from 'recompose';
import { createContainer } from 'recompose-relay'
import FaPencil from 'react-icons/lib/fa/pencil';
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up';
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down';
import ReactQuill from 'react-quill';
import CurrentRelay, {
  AddStashCommentMutation, VoteStashCommentMutation,
} from 'relay';

const ButtonReply = styled(Button)`
  background: rgba(255,255,255,0) !important;
  border: 0px !important;
  color: #aaa !important;
  padding: 0px !important;
  margin-right: 15px;
`

const PanelReply = styled(Panel)`
  margin-bottom: 0px;
  background-color: transparent;
  border: 0px;
  box-shadow: none;
  -webkit-box-shadow: none;
  & div > .panel-body {
    padding: 0px;
    margin-top: 20px;
    margin-bottom: 5px;
  }
`

const ReplyIcon = styled(FaPencil)`
  vertical-align: sub !important;
  font-size: 15px;
  color: #999;
  margin-right: 1px;
`

const VoteUpIcon = styled(FaThumbsOUp)`
  cursor: pointer;
  vertical-align: bottom !important;
  margin-right: 15px;
  font-size: 15px;
  color: ${props => props['data-isVotedUp'] ? '#2cbe4e' : '#aaa'};  
`

const VoteDownIcon = styled(FaThumbsODown)`
  cursor: pointer;
  margin-right: 15px;
  vertical-align: bottom !important;
  font-size: 15px;
  color: ${props => props['data-isVotedDown'] ? '#cb2431' : '#aaa'};
`

const DivSubmitReply = styled.div`
  text-align: right;
  margin-top: 5px;
`

const CommentFooter = ({
  isShowReply, isReply, handleReplyClick,
  content, handleTextChange, submitReply,
  onVote, isVotedUp, isVotedDown,
}) => (
  <span>
    {
      isShowReply &&
      <ButtonReply bsSize="xsmall" onClick={handleReplyClick}>
        <ReplyIcon /> Reply
      </ButtonReply>
    }
    <VoteUpIcon onClick={() => onVote(true)} data-isVotedUp={isVotedUp} />
    <VoteDownIcon
      onClick={() => onVote(false)}
      data-isVotedDown={isVotedDown}
    />
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
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      commentFooter: () => Relay.QL`
        fragment on StashComment {
          rawId
          isUserVoted
        }
      `,
    },
  }),
  withState('isReply', 'updateIsReply', false),
  withState('content', 'updateContent', ''),
  withState(
    'isVotedUp', 'updateIsVotedUp',
    props => !!props.commentFooter.isUserVoted
  ),
  withState(
    'isVotedDown', 'updateIsVotedDown',
    props => (
      props.commentFooter.isUserVoted == null ?
        false : !props.commentFooter.isUserVoted
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
      content, updateContent, updateIsReply,
      stashData: { id, stashId, stashRefId },
      parentId,
    }) => () => {
      if (content) {
        CurrentRelay.Store.commitUpdate(
          new AddStashCommentMutation({
            id,
            content,
            stashId,
            stashRefId,
            parentId,
          }),
          {
            onSuccess: () => {
              updateContent('')
              updateIsReply(false)
            },
            onFailure: transaction => console.log(transaction.getError()),
          }
        )
      }
    },
    onVote: props => isVoteUp => {
      const voteVar = typeof (isVoteUp) === 'boolean' ? isVoteUp : null
      props.toggleVote(voteVar)
      CurrentRelay.Store.commitUpdate(
        new VoteStashCommentMutation({
          id: props.stashData.id,
          isVoteUp,
          stashCommentId: props.commentFooter.rawId || null,
          stashRefId: props.stashData.stashRefId,
        })
      )
    },
  })
)(CommentFooter)
