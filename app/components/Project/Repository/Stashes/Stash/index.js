import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import StashHead from './Head';
import StashCommitStatus from './CommitStatus';
import StashComment from './StashComment';

const TableStashes = styled(Table)`
  margin-top: 20px;
  border: 1px solid rgba(27,31,35,0.15);
  padding: 8px 8px 0;
  border-radius: 3px;
  background-color: #fff;
`

const Stash = ({ stash, relay: { variables } }) => (
  <TableStashes>
    <tbody>
      <StashHead stashHead={stash} {...variables} />
      <StashCommitStatus stashCommitStatus={stash.target} {...variables} />
      <StashComment stashComment={stash} {...variables} />
    </tbody>
  </TableStashes>
)

Stash.propTypes = {
  stash: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Stash, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    stash: vars => Relay.QL`
      fragment on Ref {
        ${StashHead.getFragment('stashHead', vars)}
        ${StashComment.getFragment('stashComment', vars)}
        target {
          ... on Commit {
            ${StashCommitStatus.getFragment('stashCommitStatus', vars)}
          }
        }
      }
    `,
  },
})
