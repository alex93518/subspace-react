import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import R from 'ramda';
import moment from 'moment';
import { TableWhite, RowSty } from 'components/shared/Project/styled';
import { Col } from 'react-bootstrap';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import Commit from './Commit';

const commitsByDate = R.groupBy(commit =>
  moment.unix(commit.node.commitTime).startOf('day').format()
)

const Commits = ({
  commits: {
    ref: {
      target: {
        history: {
          edges,
        },
      },
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
    <RowSty>
      <Col>
        {
          R.toPairs(commitsByDate(edges)).map(timeEdge =>
            <div key={timeEdge[0]}>
              <div style={{ marginTop: 10, marginBottom: 10 }}>
                Commits on {moment(timeEdge[0]).format('MMMM DD, YYYY')}
              </div>
              <TableWhite>
                <tbody>
                  {timeEdge[1].map(edge =>
                    <Commit key={edge.node.id} commit={edge.node} />
                  )}
                </tbody>
              </TableWhite>
            </div>
          )
        }
      </Col>
    </RowSty>
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
              history(first: 20) {
                edges {
                  node {
                    id,
                    commitTime,
                    ${Commit.getFragment('commit')}
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
})
