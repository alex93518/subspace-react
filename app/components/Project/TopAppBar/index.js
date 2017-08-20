import React from 'react';
import { Grid } from 'react-bootstrap';
import MdTrendingUp from 'react-icons/lib/md/trending-up';
import MdPeople from 'react-icons/lib/md/people';
import MdStarOutline from 'react-icons/lib/md/star-outline';
import MdLightbulbOutline from 'react-icons/lib/md/lightbulb-outline';
import {
  AppBar, Toolbar, Button, SpanTitle,
} from './styles'

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
