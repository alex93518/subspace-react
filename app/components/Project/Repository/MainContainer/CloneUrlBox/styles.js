import styled from 'styled-components';
import { Button, Popover } from 'react-bootstrap';

export const PopoverBox = styled(Popover)`
  max-width: 375px;
`

export const CloneButton = styled(Button)`
  font-size: 12px;
  color: #fff;
  background-color: #28a745;
  background-image: linear-gradient(-180deg, #34d058 0%, #28a745 90%);
  1px solid rgba(27,31,35,0.2);
  padding: 5px 10px;
  margin-top: 5px;
  border: 1px solid #28a745;
`

export const InputUrl = styled.input`
  background-color: #fff;
  line-height: 20px;
  padding: 3px 10px;
  border: 1px solid #d1d5da;
  width: 80%;
`

export const CopyBox = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`
