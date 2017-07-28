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
      <LastCommit lastCommit={commit} />
    </div>
    <Contributors contributors={history} />
  </DivCommitStatus>
)

CommitStatus.propTypes = {
  commit: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

export default compose(
  withRelayFragment({
    commitStatus: graphql`
      fragment CommitStatus_commitStatus on TreeEntry {
        history(first: 1, refName: $branchHead) {
          ...Contributors_contributors
          edges {
            node {
              ...LastCommit_lastCommit
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    commitStatus: { history },
  }) => ({
    commit: history.edges[0].node,
    history,
  }))
)(CommitStatus)
