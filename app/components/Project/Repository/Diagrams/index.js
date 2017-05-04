import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import MainGrid from 'components/shared/MainGrid';

const Diagrams = ({ diagrams: { diagrams: { edges } } }) => (
  <MainGrid>
    <div>
      {
        edges && edges.map(({ node }) =>
          <div key={node.id}>{node.rawId}</div>
        )
      }
    </div>
  </MainGrid>
)

Diagrams.propTypes = {
  diagrams: PropTypes.object.isRequired,
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
