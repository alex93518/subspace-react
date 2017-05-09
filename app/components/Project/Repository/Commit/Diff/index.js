import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { compose, mapProps } from 'recompose';
import { createContainer } from 'recompose-relay'
import { parseDiff, totalHunk } from 'utils/diff'
import DiffHunks from './DiffHunks';

const Strong = styled.span`
  font-weight: 600;
`

const CommitDiff = ({ diff, additions, deletions, variables }) => (
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
          variables={variables}
        />
      )
    }
  </div>
)

CommitDiff.propTypes = {
  diff: PropTypes.array.isRequired,
  additions: PropTypes.number.isRequired,
  deletions: PropTypes.number.isRequired,
  variables: PropTypes.object.isRequired,
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
            changeType
            oldPath
            newPath
            diff
          }
        }
      `,
    },
  }),
  mapProps(({ commitDiff, relay: { variables } }) => {
    const diff = parseDiff(commitDiff)
    return ({
      diff,
      variables,
      additions: totalHunk('additions', diff),
      deletions: totalHunk('deletions', diff),
    })
  })
)(CommitDiff)
