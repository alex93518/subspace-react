import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import { ButtonGroup } from 'react-bootstrap';
import { CardContent } from 'components/shared/Card';
import CopyClipboardButton from 'components/shared/CopyClipboardButton'
import { LinkCommit, LinkUserName } from 'components/shared/Links';
import { ButtonGit } from 'components/shared/ButtonGit'
import { parseDiff, totalHunk } from 'utils/diff'
import { timeFromNow } from 'utils/string';
import { Card, CardHeader } from './styles';

const CommitCard = ({
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
}) => (
  <Card>
    <CardHeader
      title={(
        <span>
          {shortMessage}{' '}
        </span>
      )}
      subheader={(
        <span>
          <LinkUserName userName={user.userName} />
          {' '}
          committed {timeFromNow(commitTime)} with
          {' '}
          <span>{additions}</span> additions and
          {' '}
          <span>{deletions}</span> deletions
        </span>
      )}
      avatar={(
        <span>
          <ButtonGroup>
            <CopyClipboardButton text={oid} />
            <ButtonGit>
              <LinkCommit
                to={oid}
                vars={{
                  userName: user.userName,
                  projectName: name,
                }}
              >
                {shortId}
              </LinkCommit>
            </ButtonGit>
          </ButtonGroup>
        </span>
      )}
      classes={{
        title: 'commitTitle',
        subheader: 'commitSubheader',
      }}
      data-iconTop={-43}
    />
    <CardContent>
      diff
    </CardContent>
  </Card>
)

CommitCard.propTypes = {
  commit: PropTypes.object.isRequired,
  additions: PropTypes.number.isRequired,
  deletions: PropTypes.number.isRequired,
}

export default compose(
  withRelayFragment({
    commit: graphql`
      fragment CommitCard_commit on Commit {
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
)(CommitCard)
