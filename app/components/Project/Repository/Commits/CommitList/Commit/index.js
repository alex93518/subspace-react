import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { ButtonGroup } from 'react-bootstrap';
import { timeFromNow } from 'utils/string';
import { ButtonGit } from 'components/shared/ButtonGit'
import CopyClipboardButton from 'components/shared/CopyClipboardButton'
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

const CommitMessage = styled.h4`
  margin-top: 0px;
  margin-bottom: 7px;
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
}) => (
  <Tr>
    <TdThumb>
      <LinkUserPhoto user={user} width={36} height={36} />
    </TdThumb>
    <Td>
      <LinkCommit vars={{ ...variables, commitId: oid }}>
        <CommitMessage>{shortMessage}</CommitMessage>
      </LinkCommit>
      <span>
        <LinkUserName user={user} />
        {' '}
        committed {timeFromNow(commitTime)}
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
}

export default Relay.createContainer(Commit, {
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
      }
    `,
  },
})
