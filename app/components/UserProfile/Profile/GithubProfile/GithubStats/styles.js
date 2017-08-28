import styled from 'styled-components';
import FaGithub from 'react-icons/lib/fa/github';
import { Row } from 'react-bootstrap';

export const Icon = styled.span`
  vertical-align: bottom !important;
  font-size: 18px;
  margin-right: 6px;
`

export const NumStatRow = styled(Row)`
  margin-bottom: 10px;
  text-align: center;
`

export const NumStat = styled.div`
  color: #0C0D0E;
  font-weight: 700;
  font-size: 17px;
`

export const InfoHead = styled.div`
  color: #808080;
  font-size: 14px;  
  border-bottom: 1px solid #999;
  margin-bottom: 10px;
  padding-bottom: 5px;
`

export const FaIcon = styled(FaGithub)`
  margin-bottom: 3px;
  margin-right: 8px;
`
