import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { Button, Panel } from 'react-bootstrap';
import { compose, withState, withHandlers } from 'recompose';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up';
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down';
import ReactQuill from 'react-quill';
import CurrentRelay, { AddStashCommentMutation } from 'relay';

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
  color: #999;  
`

const VoteDownIcon = styled(FaThumbsODown)`
  cursor: pointer;
  margin-right: 15px;
  vertical-align: bottom !important;
  font-size: 15px;
  color: #999;  
`

const DivSubmitReply = styled.div`
  text-align: right;
  margin-top: 5px;
`

const CommentFooter = ({
  isShowReply, isReply, handleReplyClick,
  content, handleTextChange, submitReply,
}) => (
  <span>
    {
      isShowReply &&
      <ButtonReply bsSize="xsmall" onClick={handleReplyClick}>
        <ReplyIcon /> Reply
      </ButtonReply>
    }
    <VoteUpIcon />
    <VoteDownIcon />
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
}

export default compose(
  withState('isReply', 'updateIsReply', false),
  withState('content', 'updateContent', ''),
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
  })
)(CommentFooter)
