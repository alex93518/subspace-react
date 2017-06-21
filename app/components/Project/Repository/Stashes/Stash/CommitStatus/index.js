import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Table } from 'react-bootstrap';
import styled from 'styled-components';
import Commit from 'components/Project/Repository/Commits/CommitList/Commit'

const TableCommit = styled(Table)`
  margin-bottom: 0px !important;
  background-color: #fff;
  border: 1px solid #ddd;
  color: #777;
`

const CommitsHead = styled.h4`
  margin-top: 30px;
`

const StashCommitStatus = ({
  stashCommitStatus: { history },
  relay: { variables },
}) => (
  <div>
    <CommitsHead>Commits</CommitsHead>
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
