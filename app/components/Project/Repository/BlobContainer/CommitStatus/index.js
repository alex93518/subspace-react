import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { createContainer } from 'recompose-relay'
import { compose, mapProps } from 'recompose';
import styled from 'styled-components';
import LastCommit from 'components/shared/Project/Repository/LastCommit';
import Contributors from './Contributors';

const DivCommitStatus = styled.div`
  margin-top: 15px;
`

const CommitStatus = ({ commit, history, vars }) => (
  <DivCommitStatus>
    <div>
      <LastCommit lastCommit={commit} {...vars} />
    </div>
    <Contributors contributors={history} />
  </DivCommitStatus>
)

CommitStatus.propTypes = {
  commit: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  vars: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      commitStatus: vars => Relay.QL`
        fragment on TreeEntry {
          history(first: 1, refName: $branchHead) {
            ${Contributors.getFragment('contributors')}
            edges {
              node {
                ${LastCommit.getFragment('lastCommit', vars)}
              }
            }
          }
        }
      `,
    },
  }),
  mapProps(({
    commitStatus: { history },
    relay: { variables },
  }) => ({
    commit: history.edges[0].node,
    vars: variables,
    history,
  }))
)(CommitStatus)
