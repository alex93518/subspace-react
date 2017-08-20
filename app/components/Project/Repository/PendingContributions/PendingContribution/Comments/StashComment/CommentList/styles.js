import styled from 'styled-components';
import { NavDropdown } from 'react-bootstrap';

export const DivComment = styled.div`
  margin-bottom: 20px;
  text-align: center;
`

export const NavDropdownButton = styled(NavDropdown)`
  border: 1px solid rgba(27,31,35,0.2);
  border-radius: 4px;
  background-color: #eff3f6;
  background-image: -webkit-linear-gradient(270deg, #fafbfc 0%, #eff3f6 90%);
  background-image: linear-gradient(-180deg, #fafbfc 0%, #eff3f6 90%);
  margin-top: 4px;
  margin-right: 5px;
  color: #777;
  font-size: 13px;
  & a {
    padding: 5px 10px !important;
  }
`

export const SpanSort = styled.span`
  color: #999;
  margin-right: 5px;
`

export const SpanSortContent = styled.span`
  font-weight: 700;
`
