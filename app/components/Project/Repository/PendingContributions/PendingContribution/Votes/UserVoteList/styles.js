import styled from 'styled-components';
import { LinkUserPhoto, LinkUserName } from 'components/shared/Links';

export const UserPhoto = styled(LinkUserPhoto)`
`

export const SpanPoint = styled.span`
  margin-left: 5px;
  color: ${props => props['data-votePoint'] > 0 ? '#2cbe4e' : '#cb2431'};
`

export const SpanUser = styled.span`
  display: inline-block;
  margin: 0;
  margin-right: 25px;
  margin-top: 10px;
`

export const UserName = styled(LinkUserName)`
  margin-left: 8px;
`
