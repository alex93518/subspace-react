import styled from 'styled-components';
import { Button } from 'react-bootstrap';

export const ButtonGit = styled(Button)`
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 600;
  line-height: 20px;
  color: #777;
  border: 1px solid rgba(27,31,35,0.2);
  background-color: #eff3f6;
  background-image: -webkit-linear-gradient(270deg, #fafbfc 0%, #eff3f6 90%);
  background-image: linear-gradient(-180deg, #fafbfc 0%, #eff3f6 90%);
  &:focus {
    color: #999 !important;
  }
`
