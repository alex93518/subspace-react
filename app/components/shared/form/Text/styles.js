import styled from 'styled-components';

export const FieldContainer = styled.div`
  width: ${props => props.width || '100%'}
`

export const FieldInput = styled.input`
  background-color: #fbfbfb;
  :focus {
    background-color: #fff;
  }
`;
