import styled from 'styled-components';
import { Panel } from 'react-bootstrap';

export const PendingStashPanel = styled(Panel)`
  background: #eee;
  margin-bottom: 10px;
  & h4 {
    margin-top: 5px;
  }
  & .panel-heading {
    padding: 0px;
    border-color: white;
    border: none;
  }
  & .panel-body {
    padding: 0px;
  }
`

export const ContentDiv = styled.div`
  padding: 10px 15px;
`

export const CommitDiv = styled.div`
  margin-top: 15px;
`
