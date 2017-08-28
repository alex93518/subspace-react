import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import Contributors from './Contributors';
import { DivCommitStatus } from './styles';

const CommitStatus = ({ commit, history }) => (
  <DivCommitStatus>
    <div>
      <LastCommit commit={commit} />
    </div>
    <Contributors commitConnection={history} />
  </DivCommitStatus>
)

CommitStatus.propTypes = {
  commit: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default compose(
  withRelayFragment({
    treeEntry: graphql`
      fragment CommitStatus_treeEntry on TreeEntry {
        history(first: 1, refName: $branchHead) {
          ...Contributors_commitConnection
          edges {
            node {
              ...LastCommit_commit
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    treeEntry: { history },
  }) => ({
    commit: history.edges[0].node,
    history,
  }))
)(CommitStatus)
