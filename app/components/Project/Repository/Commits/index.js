import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { RowSty } from 'components/shared/Project/styled';
import { Col } from 'react-bootstrap';
import { matchRoute, matchRouteChild } from 'utils/routeMatcher';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import CommitList from './CommitList';

const Components = {
  CommitList: (commit, props) =>
    <CommitList {...props} commitList={commit} />,
}

const Commits = ({
  commits: {
    ref: {
      target,
    },
  },
  commits,
  relay: {
    route,
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
    {matchRouteChild(route, Components, target)}
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
              ${route => matchRoute(route, {
                CommitList: () => CommitList.getFragment('commitList', vars),
              })}
            }
          }
        }
      }
    `,
  },
})
