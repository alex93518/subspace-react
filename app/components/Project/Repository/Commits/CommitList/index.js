import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import R from 'ramda';
import moment from 'moment';
import { TableWhite, RowSty } from 'components/shared/Project/styled';
import { Col } from 'react-bootstrap';
import Commit from './Commit';

const commitsByDate = R.groupBy(commit =>
  moment.unix(commit.node.commitTime).startOf('day').format()
)

const CommitList = ({
  commitList: {
    history: {
      edges,
    },
  },
  relay: {
    variables,
  },
}) => (
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
                  <Commit
                    {...variables}
                    key={edge.node.id}
                    commit={edge.node}
                  />
                )}
              </tbody>
            </TableWhite>
          </div>
        )
      }
    </Col>
  </RowSty>
)

CommitList.propTypes = {
  commitList: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommitList, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    commitList: vars => Relay.QL`
      fragment on Commit {
        history(first: 20) {
          edges {
            node {
              id,
              commitTime,
              ${Commit.getFragment('commit', vars)}
            }
          }
        }
      }
    `,
  },
})
