import styled from 'styled-components';
import { ButtonGit } from 'components/shared/ButtonGit'
import CopyClipboardButton from 'components/shared/CopyClipboardButton'
import { LinkCommit } from 'components/shared/Links';

export const Tr = styled.tr`
  border-top: 1px solid #ddd;
`

export const Td = styled.td`
  vertical-align: middle !important;
  border-top: none !important;
  padding-left: 20px !important;
`

export const TdThumb = styled(Td)`
  padding: 15px 10px !important;
  padding-right: 0px !important;
  width: 52px;
`

export const TdCommitLink = styled(Td)`
  padding: 15px !important;
  text-align: right;
`

export const CommitMessage = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-top: 0px;
`

export const LinkCommitTitle = styled(LinkCommit)`
  color: #444;
`

export const LinkCommitGit = styled(LinkCommit)`
  color: #777;
  &:focus,:hover {
    color: #999 !important;
  }
`

export const ButtonCommit = styled(ButtonGit)`
  height: 28px;
`

export const CopyClipboard = styled(CopyClipboardButton)`
  height: 28px;
`
export const SpanAdditions = styled.span`
  font-weight: 600;
  color: #2cbe4e;
`

export const SpanDeletions = styled.span`
  font-weight: 600;
  color: #cb2431;
`
