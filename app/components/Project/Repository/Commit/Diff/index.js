import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import parse from 'parse-diff';
import styled from 'styled-components';
import { compose, mapProps } from 'recompose';
import { createContainer } from 'recompose-relay'
import R from 'ramda';
import DiffHunks from './DiffHunks';

const Strong = styled.span`
  font-weight: 600;
`

const CommitDiff = ({ diff, additions, deletions }) => (
  <div>
    <div>
      Showing {diff.length} changed files with
      {' '}
      <Strong>{additions} additions</Strong>
      {' and '}
      <Strong>{deletions} deletions</Strong>
    </div>
    {
      diff.map(file =>
        <DiffHunks
          key={`${file.oldPath}${file.newPath}`}
          hunks={file.hunks}
          oldText={file.oldText}
          newText={file.newText}
        />
      )
    }
  </div>
)

CommitDiff.propTypes = {
  diff: PropTypes.array.isRequired,
  additions: PropTypes.number.isRequired,
  deletions: PropTypes.number.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      projectName: null,
      userName: null,
    },
    fragments: {
      commitDiff: () => Relay.QL`
        fragment on Commit {
          diff {
            oldObjectId {
              text
            }
            newObjectId {
              text
            }
            changeType
            oldPath
            newPath
            diff
          }
        }
      `,
    },
  }),
  mapProps(({ commitDiff }) => {
    const diff = commitDiff.diff.map(file => ({
      ...file,
      oldText: file.oldObjectId ? file.oldObjectId.text : null,
      newText: file.newObjectId.text,
      hunks: parse(file.diff),
    }))
    const totalHunk = propName => R.pipe(
      R.map(R.path(['hunks'])),
      R.map(R.map(R.prop(propName))),
      R.flatten,
      R.reduce(R.add, 1),
      R.add(-1)
    )(diff)
    return ({
      diff,
      additions: totalHunk('additions'),
      deletions: totalHunk('deletions'),
    })
  })
)(CommitDiff)
