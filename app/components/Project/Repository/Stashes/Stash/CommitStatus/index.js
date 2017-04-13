import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Table } from 'react-bootstrap';
import styled from 'styled-components';
import { LinkProject } from 'components/shared/Links';
import Commit from 'components/Project/Repository/Commits/CommitList/Commit'


const TableCommit = styled(Table)`
  background-color: white !important;
`

const BranchLabel = styled.span`
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-weight: 600;
  background-color: #eaf5ff;
  color: #0366d6;
  border-radius: 3px;
  font-size: 13px;
  padding: 4px 8px;
  margin-right: 10px;
`

const StashCommitStatus = ({
  stashCommitStatus: { history },
  relay: { variables },
}) => (
  <tr>
    <td colSpan="2">
      <TableCommit>
        <tbody>
          <tr>
            <td colSpan="2">
              Changed from
              {' '}
              <LinkProject to={'master'} vars={variables}>
                <BranchLabel>master</BranchLabel>
              </LinkProject>
              {' (Todo: support non master branches)'}:
            </td>
          </tr>
          {
            history.edges.map(({ node }) =>
              <Commit commit={node} {...variables} key={node.id} />
            )
          }
        </tbody>
      </TableCommit>
    </td>
  </tr>
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
