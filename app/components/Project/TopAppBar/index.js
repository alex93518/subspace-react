import React from 'react';
import { Grid } from 'react-bootstrap';
import AppBarBase from 'material-ui/AppBar';
import ToolbarBase from 'material-ui/Toolbar';
import ButtonBase from 'material-ui/Button';
import MdTrendingUp from 'react-icons/lib/md/trending-up';
import MdPeople from 'react-icons/lib/md/people';
import MdStarOutline from 'react-icons/lib/md/star-outline';
import MdLightbulbOutline from 'react-icons/lib/md/lightbulb-outline';
import styled from 'styled-components';

const AppBar = styled(AppBarBase)`
  background-color: inherit !important;
  box-shadow: none !important;
`

const Toolbar = styled(ToolbarBase)`
  padding: 10px 0px !important;
  min-height: 0px!important
`

const Button = styled(ButtonBase)`
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

const SpanTitle = styled.span`
  margin-left: 8px;
`

const TopAppBar = () => (
  <Grid>
    <AppBar position={'static'}>
      <Toolbar>
        <Button data-color={'#1976D2'}>
          <MdTrendingUp width={18} height={18} />
          <SpanTitle>Trending</SpanTitle>
        </Button>
        <Button data-color={'#5E35B1'}>
          <MdLightbulbOutline width={18} height={18} />
          <SpanTitle>Top Projects</SpanTitle>
        </Button>
        <Button data-color={'#AB47BC'}>
          <MdPeople width={18} height={18} />
          <SpanTitle>Top Contributors</SpanTitle>
        </Button>
        <Button data-color={'#388E3C'}>
          <MdStarOutline width={18} height={18} />
          <SpanTitle>Hall Of Fame</SpanTitle>
        </Button>
      </Toolbar>
    </AppBar>
  </Grid>
)

export default TopAppBar;
