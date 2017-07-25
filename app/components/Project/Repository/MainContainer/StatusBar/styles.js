import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';

export const RowSty = styled(Row)`
  background-color: white;
  border: 1px solid #DDD;
  padding: 10px;
  & a {
    color: #444 !important;
  }
`

export const ColSty = styled(Col)`
  text-align: center;
`

export const Icon = styled.span`
  font-size: 18px;
  color: #777;
`
