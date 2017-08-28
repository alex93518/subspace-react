import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import Commit from 'components/Project/Repository/Commits/CommitList/Commit';
import { TableCommit } from './styles';

const CommitStatus = ({
  commit: { history },
}) => (
  <div>
    <TableCommit>
      <tbody>
        {
          history.edges.map(({ node }) =>
            <Commit commit={node} key={node.id} />
          )
        }
      </tbody>
    </TableCommit>
  </div>
)

CommitStatus.propTypes = {
  commit: PropTypes.object.isRequired,
}

export default createFragmentContainer(CommitStatus, {
  commit: graphql`
    fragment CommitStatus_commit on Commit {
      history(first: 99, isStash: true) {
        edges {
          node {
            id
            ...Commit_commit
          }
        }
      }
    }
  `,
})
