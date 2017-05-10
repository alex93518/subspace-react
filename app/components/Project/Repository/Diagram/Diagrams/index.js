import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import MainGrid from 'components/shared/MainGrid';
import { getProjectPath } from 'utils/path'

const Diagrams = ({
  diagrams: { diagrams: { edges } },
  relay: { variables },
}) => (
  <MainGrid>
    <div>
      <Link to={`${getProjectPath(variables)}/diagrams/new`}>Create new</Link>
    </div>
    <div>
      {
        edges && edges.map(({ node }) =>
          <div key={node.id}>
            <Link to={`${getProjectPath(variables)}/diagrams/${node.rawId}`}>
              {node.rawId}
            </Link>
          </div>
        )
      }
    </div>
  </MainGrid>
)

Diagrams.propTypes = {
  diagrams: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Diagrams, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    diagrams: () => Relay.QL`
      fragment on Repository {
        diagrams(first: 99) {
          edges {
            node {
              id
              rawId
            }
          }
        }
      }
    `,
  },
})
