import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import styled from 'styled-components';
import { compose, mapProps } from 'recompose';
import { parseDiff, totalHunk } from 'utils/diff';
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
        (<DiffHunks
          key={`${file.oldPath}${file.newPath}`}
          hunks={file.hunks}
        />)
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
  withRelayFragment({
    commitDiff: graphql`
      fragment Diff_commitDiff on Commit {
        diff {
          changeType
          oldPath
          newPath
          diff
        }
      }
    `,
  }),
  mapProps(({ commitDiff }) => {
    const diff = parseDiff(commitDiff);
    return ({
      diff,
      additions: totalHunk('additions', diff),
      deletions: totalHunk('deletions', diff),
    });
  })
)(CommitDiff)
