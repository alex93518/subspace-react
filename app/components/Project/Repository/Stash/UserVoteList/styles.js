import styled from 'styled-components';
import { LinkUserPhoto } from 'components/shared/Links';

export const DivTitle = styled.div`
  color: #586069;
  line-height: 16px;
  font-weight: 600;
  padding: 5px 0;
  margin-bottom: 10px;
`

export const UserPhoto = styled(LinkUserPhoto)`
  margin-right: 7px;
`

export const SpanPoint = styled.span`
  margin-left: 5px;
  color: ${props => props['data-votePoint'] > 0 ? '#2cbe4e' : '#cb2431'};
`

export const DivUser = styled.div`
  margin: 10px 0;
`
