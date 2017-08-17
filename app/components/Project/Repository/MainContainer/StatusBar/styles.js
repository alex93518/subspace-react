import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';

export const RowSty = styled(Row)`
  background-color: rgba(3, 155, 229, 0.8);
  border: 1px solid #7cb7d4;
  padding: 10px;
  & a {
    color: rgba(255,255,255,1) !important;
  }
`

export const ColSty = styled(Col)`
  text-align: center;
  color: rgba(255,255,255,1);
`

export const Icon = styled.span`
  font-size: 18px;
  color: rgba(255,255,255,1);
`
