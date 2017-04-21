import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import CommitList from './CommitList';

const DivCommits = styled.div`
  margin-top: 15px;
`

const Commits = ({
  commits: {
    ref: {
      target,
    },
  },
  commits,
  relay: {
    variables,
  },
}) => (
  <DivCommits>
    <BranchSelect
      {...variables}
      branchSelect={commits}
      suffix={`commits${variables.splat ? `/${variables.splat}` : ''}`}
    />
    <CommitList {...variables} commitList={target} />
  </DivCommits>
)

Commits.propTypes = {
  commits: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Commits, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: null,
  },
  fragments: {
    commits: vars => Relay.QL`
      fragment on Repository {
        ${BranchSelect.getFragment('branchSelect', vars)}        
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              ${CommitList.getFragment('commitList', vars)}
            }
          }
        }
      }
    `,
  },
})
