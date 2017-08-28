import styled from 'styled-components';
import { Row } from 'react-bootstrap';

export const TitleDiv = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: #777;
  margin-top: 20px;
  margin-bottom: 8px;
`

export const MainRow = styled(Row)`
  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
  margin: 0px;
  padding: 15px 0px;
`

export const DivRepoName = styled.div`
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  padding: 10px 15px;
  border-radius: 5px;
  color: ${props => props['data-isActive'] ? '#fff' : '#333'};
  background: ${props => props['data-isActive'] ? '#777' : '#fff'};
`
