import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import styled from 'styled-components';
import { ButtonGroup } from 'react-bootstrap';
import { timeFromNow } from 'utils/string';
import { ButtonGit } from 'components/shared/ButtonGit'
import CopyClipboardButton from 'components/shared/CopyClipboardButton'
import { compose, mapProps } from 'recompose';
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
  border-top: none !important;
`

const TdThumb = styled(Td)`
  padding: 15px !important;
  width: 52px;
`

const TdCommitLink = styled(Td)`
  padding: 15px !important;
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
  commitItem: {
    oid,
    shortId,
    shortMessage,
    commitTime,
    author: {
      user,
    },
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
        <LinkCommitTitle to={oid}>
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
          <LinkCommitGit to={oid}>
            {shortId}
          </LinkCommitGit>
        </ButtonCommit>
      </ButtonGroup>
    </TdCommitLink>
  </Tr>
);

Commit.propTypes = {
  commitItem: PropTypes.object.isRequired,
  additions: PropTypes.number.isRequired,
  deletions: PropTypes.number.isRequired,
};

export default compose(
  withRelayFragment({
    commitItem: graphql`
      fragment Commit_commitItem on Commit {
        oid
        shortId
        shortMessage
        commitTime
        author {
          user {
            ...LinkUserName_user
            ...LinkUserPhoto_user
          }
        }
        diff {
          diff
        }
      }
    `,
  }),
  mapProps(({ commitItem }) => {
    const diff = parseDiff(commitItem);
    return ({
      commitItem,
      additions: totalHunk('additions', diff),
      deletions: totalHunk('deletions', diff),
    })
  })
)(Commit)
