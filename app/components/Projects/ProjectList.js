import React, { PropTypes } from 'react'
import Relay from 'react-relay/classic'
import R from 'ramda'
import Project from './Project'

export const ProjectList = ({ viewer: { repositories } }) => (
  <div>
    {
      R.pipe(
        R.prop('edges'),
        R.map(R.prop('node')),
        R.sortWith([
          R.descend(R.prop('createdAt')),
        ]),
        R.map(node => <Project key={node.id} project={node} />),
      )(repositories)
    }
  </div>
)

ProjectList.propTypes = {
  viewer: PropTypes.object,
}

export default Relay.createContainer(ProjectList, {
  initialVariables: {
    owner: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        repositories(first: 10, ownerName: $owner) {
          edges {
            node {
              id
              createdAt
              ${Project.getFragment('project')}
            }
          }
        }
      }
    `,
  },
})
