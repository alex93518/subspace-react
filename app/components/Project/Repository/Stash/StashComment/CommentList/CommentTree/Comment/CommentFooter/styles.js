import styled from 'styled-components';
import { Button, Panel } from 'react-bootstrap';
import FaPencil from 'react-icons/lib/fa/pencil';
import FaThumbsOUp from 'react-icons/lib/fa/thumbs-o-up';
import FaThumbsODown from 'react-icons/lib/fa/thumbs-o-down';

export const ButtonReply = styled(Button)`
  background: rgba(255,255,255,0) !important;
  border: 0px !important;
  color: #aaa !important;
  padding: 0px !important;
  margin-right: 15px;
`

export const PanelReply = styled(Panel)`
  margin-bottom: 0px;
  background-color: transparent;
  border: 0px;
  box-shadow: none;
  -webkit-box-shadow: none;
  & div > .panel-body {
    padding: 0px !important;
    margin-top: 20px;
    margin-bottom: 5px;
    border: 0px !important;
    animation: none !important;
  }
`

export const ReplyIcon = styled(FaPencil)`
  vertical-align: sub !important;
  font-size: 15px;
  color: #999;
  margin-right: 1px;
`

export const VoteUpIcon = styled(FaThumbsOUp)`
  cursor: pointer;
  vertical-align: sub !important;
  margin-right: 5px;
  font-size: 15px;
  color: ${props => props['data-isVotedUp'] ? '#2cbe4e' : '#aaa'};  
`

export const VoteDownIcon = styled(FaThumbsODown)`
  cursor: pointer;
  margin-right: 5px;
  vertical-align: sub !important;
  font-size: 15px;
  color: ${props => props['data-isVotedDown'] ? '#cb2431' : '#aaa'};
`

export const SpanVotePoint = styled.span`
  color: #999;
  margin-right: 15px;
`

export const DivSubmitReply = styled.div`
  text-align: right;
  margin-top: 5px;
`
