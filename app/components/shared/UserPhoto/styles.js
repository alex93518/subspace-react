import styled from 'styled-components';
import FaUser from 'react-icons/lib/fa/user';

export const MainSpan = styled.span`
  display: inline-block;
  vertical-align: middle;
`

export const UserIcon = styled(FaUser)`
  font-size: 140px;
  color: rgba(3, 102, 214, 0.54);
`;

export const SpanPresence = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  height: ${props => props['data-height']}px;
  width: ${props => props['data-width']}px;
  background:#fff;
`

export const SpanContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  height: ${props => props['data-height']}px;
  width: ${props => props['data-width']}px;
  ${props => props['data-isOnline'] ? `
    background: #b4ddb4;
    background: -moz-linear-gradient(top, #b4ddb4 0%, #83c783 17%, #52b152 33%, #008a00 67%, #00770b 100%);
    background: -webkit-linear-gradient(top, #b4ddb4 0%,#83c783 17%,#52b152 33%,#008a00 67%,#00770b 100%);
    background: linear-gradient(to bottom, #b4ddb4 0%,#83c783 17%,#52b152 33%,#008a00 67%,#00770b 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#b4ddb4', endColorstr='#00770b',GradientType=0 );  
    ` : 'background: none;'
  }
  border: ${props => props['data-isOnline'] ? 'none' : '1px solid #ddd'};
`
