import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import { LinkCommitsFile } from 'components/shared/Links';

export const FileStatusTable = styled(Table)`
  margin-top: 15px;
  margin-bottom: -1px;
  background-color: #fafbfc;
  border:1px solid #ccc;
  border-bottom: 0px;
  border-radius:3px;
  border-bottom-right-radius:0;
  border-bottom-left-radius:0;
`

export const FileInfoDivider = styled.span`
  display: inline-block;
  width: 1px;
  height: 18px;
  margin-right: 10px;
  margin-left: 10px;
  background-color: #ddd;
  vertical-align: middle;
`

export const TdFileAction = styled.td`
  vertical-align: middle !important;
  text-align: right;
`

export const TdFileInfo = styled.td`
  vertical-align: middle !important;
  padding-left: 10px;
`

export const LinkHistoryFile = styled(LinkCommitsFile)`
  color: #777;
  &:focus,:hover {
    color: #999 !important;
  }
`
