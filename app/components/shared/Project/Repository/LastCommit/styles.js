import styled from 'styled-components';
import { LinkUserName, LinkCommit } from 'components/shared/Links';

export const DivCommit = styled.div`
  padding: 10px;
  margin-bottom:-1px;
  line-height:20px;
  color:#586069;
  background-color:#f1f8ff;
  border:1px solid #c8e1ff;
  border-radius:3px;
  border-bottom-right-radius:0;
  border-bottom-left-radius:0;
  clear: both;
`

export const LinkUser = styled(LinkUserName)`
  margin-left: 10px;
`

export const LinkShortId = styled(LinkCommit)`
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  color: #586069;
  margin-left: 7px;
  margin-right: 7px;
`

export const LinkShortMsg = styled(LinkCommit)`
  color: #586069;
  margin-left: 7px;
`

export const DivUser = styled.div`
  display: inline-block;
`

export const DivStatus = styled.div`
  display: inline-block;
  float: right;
`
