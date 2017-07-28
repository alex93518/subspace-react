import { Row, Col, Modal, Media } from 'react-bootstrap';
import styled from 'styled-components';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import FaCaretDown from 'react-icons/lib/fa/caret-down';

export const MainRow = styled(Row)`
  margin-bottom: 20px;
  border: 0px;
`

export const StashLabel = styled.span`
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-weight: 600;
  background-color: #eaf5ff;
  color: #0366d6;
  border-radius: 3px;
  font-size: 13px;
  padding: 4px 8px;
  margin-right: 10px;
`

export const H2Head = styled.h2`
  margin-top: 0px;
`

export const SpanStashNum = styled.span`
  margin-right: 20px;
`

export const IconUp = styled(FaCaretUp)`
  font-size: 48px;
  cursor: pointer;
  margin-top: -10px;
  color: ${props => props['data-isVotedUp'] ? '#2cbe4e' : '#aaa'};
`

export const IconDown = styled(FaCaretDown)`
  font-size: 48px;
  cursor: pointer;
  color: ${props => props['data-isVotedDown'] ? '#cb2431' : '#aaa'};
`

export const NumberDiv = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #777;
`

export const IconCol = styled(Col)`
  padding-left: 15px;
  padding-right: 0px;
  text-align: center;
`

export const RowVoteStats = styled(Row)`
  margin-top: 10px;
`

export const SpanAcceptPoint = styled.span`
  font-weight: 700;
  color: #2cbe4e;
`

export const SpanRejectPoint = styled.span`
  font-weight: 700;
  color: #cb2431;
`

export const ColStatus = styled(Col)`
  padding-left: 30px;
`

export const AcceptModal = styled(Modal)`
  position: fixed;
  top: 50% !important;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  .modal-dialog {
    width: 250px;
  }
  .modal-body {
    width: 250px;
  }
`

export const MediaBody = styled(Media.Body)`
  padding-left: 13px;
`

export const MediaLeft = styled(Media.Left)`
  padding-top: 5px;
`

export const AcceptHead = styled.h4`
  margin-top: 5px;
`
