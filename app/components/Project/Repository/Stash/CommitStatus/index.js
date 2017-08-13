import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import Commit from 'components/Project/Repository/Commits/CommitList/Commit';
import { TableCommit } from './styles';

const StashCommitStatus = ({
  stashCommitStatus: { history },
}) => (
  <div>
    <TableCommit>
      <tbody>
        {
          history.edges.map(({ node }) =>
            <Commit commitItem={node} key={node.id} />
          )
        }
      </tbody>
    </TableCommit>
  </div>
)

StashCommitStatus.propTypes = {
  stashCommitStatus: PropTypes.object.isRequired,
}

export default createFragmentContainer(StashCommitStatus, {
  stashCommitStatus: graphql`
    fragment CommitStatus_stashCommitStatus on Commit {
      history(first: 99, isStash: true) {
        edges {
          node {
            id
            ...Commit_commitItem
          }
        }
      }
    }
  `,
})
