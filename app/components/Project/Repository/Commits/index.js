import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import CommitList from './CommitList';

const RowSty = styled(Row)`
  padding-top: 15px;
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
