import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import RepositoryQueryRenderer from 'relay/RepositoryQueryRenderer';
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
  repository: PropTypes.object,
}

const CommitQuery = ({ vars }) => (
  <RepositoryQueryRenderer vars={vars} query={query}>
    <Commit />
  </RepositoryQueryRenderer>
)

CommitQuery.propTypes = {
  vars: PropTypes.object.isRequired,
};

const query = graphql`
  query CommitQuery(
    $userName: String!, $projectName: String!,
    $branchHead: String!, $commitId: String!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        ref(refName: $branchHead) {
          commit(commitId: $commitId) {
            ...Head_commit
            ...Status_commit
            ...Diff_commit
          }
        }
      }
    }
  }
`;

export default CommitQuery;
