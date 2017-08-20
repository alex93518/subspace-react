import styled from 'styled-components';
import AppBarBase from 'material-ui/AppBar';
import ToolbarBase from 'material-ui/Toolbar';
import ButtonBase from 'material-ui/Button';
import TypographyBase from 'material-ui/Typography';
import BadgeBase from 'material-ui/Badge';

export const AppBar = styled(AppBarBase)`
  flex-direction: row !important;
  background-color: inherit !important;
  box-shadow: none !important;  
`

export const Toolbar = styled(ToolbarBase)`
  padding: 10px 0px !important;
  padding-right: 40px !important;
  min-height: 0px!important
`

export const Button = styled(ButtonBase)`
  text-transform: none !important;
  font-size: 13px;
  margin-right: 5px;
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

export const Typography = styled(TypographyBase)`
  margin-right: 10px;
`

export const Badge = styled(BadgeBase)`
  & span {
    position: relative !important;
    top: 0px !important;
    right: 0px !important;
    color: #fff !important;
    background-color: ${props => props['data-color']};
    width: 24px;
    height: 16px;
    border-radius: 30%;
  }
  margin-left: 3px;
`
