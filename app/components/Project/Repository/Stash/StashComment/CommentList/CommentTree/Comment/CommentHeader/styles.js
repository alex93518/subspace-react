import { DropdownButton } from 'react-bootstrap';
import styled from 'styled-components';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import MdMoreVert from 'react-icons/lib/md/more-vert';

export const SpanVoterStat = styled.span`
  display: inline-block;
  float: right;
`

export const IconUp = styled(FaCaretUp)`
  font-size: 16px;
  margin-right: 3px;
  vertical-align: sub !important;
  color: #2cbe4e;
`

export const IconDown = styled(FaCaretDown)`
  font-size: 16px;
  margin-right: 3px;
  vertical-align: sub !important;
  color: #cb2431;
`

export const DropdownHead = styled(DropdownButton)`
  margin-left: 10px !important;
  background: transparent !important;
  padding: 0px !important;
  border: 0px !important;
`

export const IconMore = styled(MdMoreVert)`
  color: #777;
  cursor: pointer;
  font-size: 16px;
  vertical-align: text-bottom !important;
`
