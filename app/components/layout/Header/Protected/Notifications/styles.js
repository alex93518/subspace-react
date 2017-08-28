import styled from 'styled-components';
import FaBell from 'react-icons/lib/fa/bell';
import { Popover, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const NotifSpan = styled.span`
  position:relative;
`

export const NotifCircle = styled.span`
  display: ${props => props['data-isUnread'] ? 'inline' : 'none'};
  position:absolute;
  top:0px;
  right:0px;
  font-size:.7em;
  background: #ef3535;
  width:10px;
  height:10px;
  text-align:center;
  line-height:18px;
  border-radius:50%;
  box-shadow:0 0 1px #333;
`
export const NotifIcon = styled(FaBell)`
  color: ${props => props['data-isUnread'] ? '#eee' : '#777 !important'};
`

export const NotifPopover = styled(Popover)`
  max-width: 350px;
`

export const NotifLink = styled(Link)`
  color: #777;
`

export const NotifTable = styled(Table)`
  margin-bottom: 5px;
  border-bottom: 1px solid #ddd;
`
