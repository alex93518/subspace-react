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
  commit: {
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
  isHideAvatar,
}) => (
  <Tr>
    {!isHideAvatar && (
      <TdThumb>
        <LinkUserPhoto user={user} width={36} height={36} />
      </TdThumb>
    )}
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
  commit: PropTypes.object.isRequired,
  additions: PropTypes.number.isRequired,
  deletions: PropTypes.number.isRequired,
  isHideAvatar: PropTypes.bool,
};

export default compose(
  withRelayFragment({
    commit: graphql`
      fragment Commit_commit on Commit {
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
  mapProps(({ commit, ...rest }) => {
    const diff = parseDiff(commit);
    return ({
      commit,
      additions: totalHunk('additions', diff),
      deletions: totalHunk('deletions', diff),
      ...rest,
    })
  })
)(Commit)
