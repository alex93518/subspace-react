import React, { PropTypes } from 'react';
import Relay from 'react-relay';

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
}) => (
  <div>
    {edges.map(edge =>
      <div key={edge.node.id}>{edge.node.shortMessage}</div>
    )}
  </div>
)

Commits.propTypes = {
  commits: PropTypes.object.isRequired,
}

export default Relay.createContainer(Commits, {
  initialVariables: {
    branchHead: 'master',
  },
  fragments: {
    commits: () => Relay.QL`
      fragment on Repository {
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              history(first: 10) {
                edges {
                  node {
                    id
                    shortMessage
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
