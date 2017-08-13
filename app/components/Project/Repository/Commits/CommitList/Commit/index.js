import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { ButtonGroup } from 'react-bootstrap';
import { timeFromNow } from 'utils/string';
import { compose, mapProps } from 'recompose';
import { parseDiff, totalHunk } from 'utils/diff'
import { LinkUserName, LinkUserPhoto } from 'components/shared/Links';
import {
  Tr, TdThumb, Td, CommitMessage, LinkCommitTitle,
  SpanAdditions, SpanDeletions, TdCommitLink,
  CopyClipboard, ButtonCommit, LinkCommitGit,
} from './styles';

const Commit = ({
  commitItem: {
    oid,
    shortId,
    shortMessage,
    commitTime,
    author: {
      user,
    },
    repository: {
      name,
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
        <LinkCommitTitle
          to={oid}
          vars={{
            userName: user.userName,
            projectName: name,
          }}
        >
          {shortMessage}
        </LinkCommitTitle>
      </CommitMessage>
      <span>
        <LinkUserName userName={user.userName} />
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
            to={oid}
            vars={{
              userName: user.userName,
              projectName: name,
            }}
          >
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
            userName
            photoUrl
          }
        }
        repository {
          name
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
