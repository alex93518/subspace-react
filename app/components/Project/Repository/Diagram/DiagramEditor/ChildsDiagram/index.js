import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import DiagramWidget from '../DiagramWidget';

const ChildsDiagram = ({
  childsDiagram,
  relay: { variables },
}) => (
  <div>
    {
      childsDiagram &&
      childsDiagram.childs.edges &&
      childsDiagram.childs.edges.length > 0 && (
      <div>
        {childsDiagram.childs.edges.map(({ node }) =>
          <DiagramWidget
            key={node.id}
            diagramWidget={node}
            {...variables}
          />
        )}
      </div>
    )}
  </div>
)

ChildsDiagram.propTypes = {
  childsDiagram: PropTypes.object,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(ChildsDiagram, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    childsDiagram: vars => Relay.QL`
      fragment on Diagram {
        childs(first: 99) {
          edges {
            node {
              id
              ${DiagramWidget.getFragment('diagramWidget', vars)}
            }
          }
        }
      }
    `,
  },
})
