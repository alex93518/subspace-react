import styled from 'styled-components';

export const MainDiv = styled.div`
  cursor: pointer;
  padding: 10px 15px;
  border: 1px solid ${
    props => props['data-isClear'] ?
    'rgba(45, 132, 48, 0.6)' :
    'rgba(214, 185, 45, 0.47)'
  };
  border-left: 6px solid ${
    props => props['data-isClear'] ?
    'rgba(45, 132, 48, 0.6)' :
    'rgba(214, 185, 45, 0.7)'
  };
`

export const IconContainer = styled.div`
  float: right;
`

