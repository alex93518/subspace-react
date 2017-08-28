import styled from 'styled-components';

export const MainCardDiv = styled.div`
  cursor: pointer;
`

export const IconDiv = styled.div`
  float: right;
  margin-right: 10px;
  margin-top: ${props => props['data-iconTop'] || -52}px;
`;
