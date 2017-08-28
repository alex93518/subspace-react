import styled from 'styled-components';
import AppBarBase from 'material-ui/AppBar';
import ToolbarBase from 'material-ui/Toolbar';
import ButtonBase from 'material-ui/Button';

export const AppBar = styled(AppBarBase)`
  background-color: inherit !important;
  box-shadow: none !important;
`

export const Toolbar = styled(ToolbarBase)`
  padding: 10px 0px !important;
  min-height: 0px!important
`

export const Button = styled(ButtonBase)`
  text-transform: none !important;
  margin-right: 10px;
  border-radius: 20px !important;
  min-height: 30px !important;
  padding: 0px 24px !important;
  box-shadow: none !important;
  background-color: #fff !important;
  border: 1px solid ${props => props['data-color']} !important;
  color: ${props => props['data-color']} !important;
  &:hover {
    background-color: ${props => props['data-color']} !important;
    color: #fff !important;
  }
`

export const SpanTitle = styled.span`
  margin-left: 8px;
`
