import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { Timeline, TimelineEvent } from 'react-event-timeline';

export const TimelineMain = styled(Timeline)`
  padding: 0px !important;
  margin: 30px 0px !important;
  font-size: 100% !important;
`

export const TimelineCommits = styled(TimelineEvent)`
  padding: 0px;
`

export const TableWhite = styled(Table)`
  border: 1px solid #ddd;
  margin-top: 10px;
`
