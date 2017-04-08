import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import CommitHead from './Head';
import CommitStatus from './Status';
import CommitDiff from './Diff';

const TableHead = styled(Table)`
  margin-top: 15px;
  border: 1px solid rgba(27,31,35,0.15);
  padding: 8px 8px 0;
  border-radius: 3px;
  background-color: #fff;
`

const Commit = ({
  commit: { ref: { commit } },
  relay: { variables },
}) => (
  <div>
    <TableHead>
      <tbody>
        <CommitHead commitHead={commit} {...variables} />
        <CommitStatus commitStatus={commit} {... variables} />
      </tbody>
    </TableHead>
    <CommitDiff commitDiff={commit} {...variables} />
  </div>
)

Commit.propTypes = {
  commit: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Commit, {
  initialVariables: {
    branchHead: 'master',
    projectName: null,
    userName: null,
    commitId: null,
  },
  fragments: {
    commit: vars => Relay.QL`
      fragment on Repository {
        ref(refName: $branchHead) {
          commit(commitId: $commitId) {
            ${CommitHead.getFragment('commitHead', vars)}
            ${CommitStatus.getFragment('commitStatus')}
            ${CommitDiff.getFragment('commitDiff', vars)}
          }
        }
      }
    `,
  },
})
