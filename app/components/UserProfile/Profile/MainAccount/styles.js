import styled from 'styled-components';
import Separator from 'components/shared/Separator';
import FaUser from 'react-icons/lib/fa/user';
import { Row, Panel } from 'react-bootstrap';

export const UserPanel = styled(Panel)`
  text-align: center;
`

export const RowInfoPanel = styled(Row)`
  margin-top: 10px;
`

export const HeadUserName = styled.h2`
  margin-top: 0px;
`

export const SubHead = styled.h4`
  margin-top: 0px;
  margin-bottom: 15px;
`

export const NameSeparator = styled(Separator)`
  margin-top: 0px;
`

export const UserIcon = styled(FaUser)`
  font-size: 140px;
  color: rgba(3, 102, 214, 0.54);
`
