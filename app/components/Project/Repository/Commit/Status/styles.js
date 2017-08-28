import styled from 'styled-components';
import { Col } from 'react-bootstrap';
import { LinkUserName } from 'components/shared/Links';

export const Td = styled.td`
  padding: 15px !important;
`

export const ColCommitId = styled(Col)`
  text-align: right;
`

export const UserName = styled(LinkUserName)`
  margin-left: 10px;
`
