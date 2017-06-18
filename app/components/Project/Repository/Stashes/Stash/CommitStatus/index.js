import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { Table } from 'react-bootstrap';
import styled from 'styled-components';
import Commit from 'components/Project/Repository/Commits/CommitList/Commit'

const TableCommit = styled(Table)`
  margin-bottom: 0px !important;
`

const StashCommitStatus = ({
  stashCommitStatus: { history },
  relay: { variables },
}) => (
  <div>
    <h4>Commits</h4>
    <TableCommit>
      <tbody>
        {
          history.edges.map(({ node }) =>
            <Commit commit={node} {...variables} key={node.id} />
          )
        }
      </tbody>
    </TableCommit>
  </div>
)

StashCommitStatus.propTypes = {
  stashCommitStatus: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(StashCommitStatus, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    stashCommitStatus: vars => Relay.QL`
      fragment on Commit {
        history(first: 99, isStash: true) {
          edges {
            node {
              id
              ${Commit.getFragment('commit', vars)}
            }
          }
        }
      }
    `,
  },
})
