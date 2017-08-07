import styled from 'styled-components';
import { Button, NavItem, ToggleButton, Popover } from 'react-bootstrap';
import FaUser from 'react-icons/lib/fa/user';
import FaAngleDown from 'react-icons/lib/fa/angle-down';
import Separator from 'components/shared/Separator';

export const NavItemWhite = styled(NavItem)`
  & a {
    padding-top: 9px !important;
    color: rgba(255,255,255,0.75) !important;
  }
`

export const UserIcon = styled(FaUser)`
  font-size: 140px;
  color: rgba(3, 102, 214, 0.54);
`;

export const SignoutButton = styled(Button)`
  display: inline;
  padding: 0 6px;
`

export const SpanName = styled.span`
  margin-left: 10px;
  color: rgba(255,255,255,0.90) !important;
`

export const AngleDownName = styled(FaAngleDown)`
  margin-left: 5px;
  padding-bottom: 2px;
  width: 20px;
  height: 20px;
  color: rgba(255,255,255,0.75) !important;
`

export const UserSeparator = styled(Separator)`
  margin-top: 10px;
  margin-bottom: 10px;
`

export const OnlineButton = styled(ToggleButton)`
  width: 150px;
  margin-top: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #b9b9b9;
  &.active {
    background-color: #fff !important;
    color: #139915 !important;
    font-weight: 600;
    box-shadow: none !important;
  }
`

export const UserPopover = styled(Popover)`
  max-width: 350px;
`

export const SpanTitle = styled.span`
  margin-left: 10px;
`

export const SignOutDiv = styled.div`
  clear: both;
  margin-bottom: 5px;
`

export const UserNameDiv = styled.div`
  float: right;
  margin-top: 5px;
  margin-right: 3px;
  color: #bbb;
`
