import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import CommitHead from './Head';
import CommitStatus from './Status';
import CommitDiff from './Diff';

const MainDiv = styled.div`
  margin: 20px;
`

const TableHead = styled(Table)`
  margin-top: 15px;
  border: 1px solid rgba(27,31,35,0.15);
  padding: 8px 8px 0;
  border-radius: 3px;
  background-color: #fff;
`

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
