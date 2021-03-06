import styled from 'styled-components';
import { Nav, NavItem as NavItemBase } from 'react-bootstrap';
import BadgeBase from 'material-ui/Badge';

export const NavLabel = styled.span`
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
`

export const RepoTitle = styled.h3`
  margin-bottom: 25px;
`
export const TopContainer = styled.div`
  background-color: #fafbfc;
  border-bottom: 1px solid #dddddd;
`

export const Icon = styled.span`
  font-size: 18px;
  margin-right: 5px;
`

export const MainNavTabs = styled(Nav)`
  border: none;
`

export const NavItem = styled(NavItemBase)`
  & a {
    color: #fff;
  }
  & .active {
    & a {
      color: #777;
    }
  }
  
  & a:hover {
    color: #777 !important;
  }
`

export const Badge = styled(BadgeBase)`
  & span {
    position: relative !important;
    top: 0px !important;
    right: 0px !important;
    color: #fff !important;
  }
  margin-left: 5px;
`
