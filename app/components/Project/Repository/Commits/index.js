import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { RowSty } from 'components/shared/Project/styled';
import { Col } from 'react-bootstrap';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import CommitList from './CommitList';

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
  <Col md={12}>
    <RowSty>
      <Col>
        <BranchSelect
          {...variables}
          branchSelect={commits}
          suffix={'commits'}
        />
      </Col>
    </RowSty>
    <CommitList {...variables} commitList={target} />
  </Col>
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
