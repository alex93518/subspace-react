import React from 'react';
import PropTypes from 'prop-types';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';
import R from 'ramda'
import Project from './Project'

export const ProjectList = ({ viewer: { repositories } }) => (
  <div>
    {
      (repositories && repositories.edges && repositories.edges.length > 0) ?
        <div>
          <h3>Projects</h3>
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
        </div> :
        <h3>No project yet</h3>
    }
  </div>
)

ProjectList.propTypes = {
  viewer: PropTypes.object,
};

export default createFragmentContainer(ProjectList, {
  viewer: graphql`
    fragment ProjectList_viewer on Viewer {
      repositories(first: 10, ownerName: $owner) {
        edges {
          node {
            id
            createdAt
            ...Project_project
          }
        }
      }
    }
  `,
})
