import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import CommitHead from './Head';
import CommitStatus from './Status';
import CommitDiff from './Diff';
import { MainDiv, TableHead } from './styles'

const Commit = ({
  commit: { ref: { commit } },
}) => (
  <MainDiv>
    <TableHead>
      <tbody>
        <CommitHead commitHead={commit} />
        <CommitStatus commitStatus={commit} />
      </tbody>
    </TableHead>
    <CommitDiff commitDiff={commit} />
  </MainDiv>
)

Commit.propTypes = {
  commit: PropTypes.object.isRequired,
}

export default createFragmentContainer(Commit, {
  commit: graphql`
    fragment Commit_commit on Repository {
      ref(refName: $branchHead) @include(if: $isCommit) {
        commit(commitId: $commitId) {
          ...Head_commitHead
          ...Status_commitStatus
          ...Diff_commitDiff
        }
      }
    }
  `,
})
