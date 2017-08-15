import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import CommitHead from './Head';
import CommitStatus from './Status';
import CommitDiff from './Diff';
import { MainDiv, TableHead } from './styles'

const Commit = ({
  repository: { ref: { commit } },
}) => (
  <MainDiv>
    <TableHead>
      <tbody>
        <CommitHead commit={commit} />
        <CommitStatus commit={commit} />
      </tbody>
    </TableHead>
    <CommitDiff commit={commit} />
  </MainDiv>
)

Commit.propTypes = {
  repository: PropTypes.object.isRequired,
}

export default createFragmentContainer(Commit, {
  repository: graphql`
    fragment Commit_repository on Repository {
      ref(refName: $branchHead) @include(if: $isCommit) {
        commit(commitId: $commitId) {
          ...Head_commit
          ...Status_commit
          ...Diff_commit
        }
      }
    }
  `,
})
