import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { ButtonGroup } from 'react-bootstrap';
import { timeFromNow } from 'utils/string';
import { ButtonGit } from 'components/shared/ButtonGit'
import CopyClipboardButton from 'components/shared/CopyClipboardButton'
import { compose, mapProps } from 'recompose';
import { createContainer } from 'recompose-relay'
import { parseDiff, totalHunk } from 'utils/diff'
import {
  LinkUserName,
  LinkUserPhoto,
  LinkCommit,
} from 'components/shared/Links';

const Tr = styled.tr`
  border-top: 1px solid #ddd;
`

const Td = styled.td`
  vertical-align: middle !important;
  padding: 8px !important;
  border-top: none !important;
`

const TdThumb = styled(Td)`
  padding-left: 15px !important;
  width: 52px;
`

const TdCommitLink = styled(Td)`
  padding-right: 15px !important;
  text-align: right;
`

const CommitMessage = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-top: 0px;
`

const LinkCommitTitle = styled(LinkCommit)`
  color: #444;
`

const LinkCommitGit = styled(LinkCommit)`
  color: #777;
  &:focus,:hover {
    color: #999 !important;
  }
`

const ButtonCommit = styled(ButtonGit)`
  height: 28px;
`

const CopyClipboard = styled(CopyClipboardButton)`
  height: 28px;
`
const SpanAdditions = styled.span`
  font-weight: 600;
  color: #2cbe4e;
`

const SpanDeletions = styled.span`
  font-weight: 600;
  color: #cb2431;
`

const Commit = ({
  commit: {
    oid,
    shortId,
    shortMessage,
    commitTime,
    author: {
      user,
    },
  },
  relay: {
    variables,
  },
  additions,
  deletions,
}) => (
  <Tr>
    <TdThumb>
      <LinkUserPhoto user={user} width={36} height={36} />
    </TdThumb>
    <Td>
      <CommitMessage>
        <LinkCommitTitle vars={{ ...variables, commitId: oid }}>
          {shortMessage}
        </LinkCommitTitle>
      </CommitMessage>
      <span>
        <LinkUserName user={user} />
        {' '}
        committed {timeFromNow(commitTime)} with
        {' '}
        <SpanAdditions>{additions}</SpanAdditions> additions and
        {' '}
        <SpanDeletions>{deletions}</SpanDeletions> deletions
      </span>
    </Td>
    <TdCommitLink>
      <ButtonGroup>
        <CopyClipboard text={oid} />
        <ButtonCommit>
          <LinkCommitGit
            vars={{ ...variables, commitId: oid }}
          >
            {shortId}
          </LinkCommitGit>
        </ButtonCommit>
      </ButtonGroup>
    </TdCommitLink>
  </Tr>
)

Commit.propTypes = {
  commit: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
  additions: PropTypes.number.isRequired,
  deletions: PropTypes.number.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      commit: () => Relay.QL`
        fragment on Commit {
          oid
          shortId
          shortMessage
          commitTime
          author {
            user {
              ${LinkUserName.getFragment('user')}
              ${LinkUserPhoto.getFragment('user')}
            }
          }
          diff {
            diff
          }
        }
      `,
    },
  }),
  mapProps(({ commit, relay }) => {
    const diff = parseDiff(commit)
    return ({
      commit,
      relay,
      additions: totalHunk('additions', diff),
      deletions: totalHunk('deletions', diff),
    })
  })
)(Commit)
