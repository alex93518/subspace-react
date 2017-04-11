import React, { PropTypes } from 'react'
import Helmet from 'react-helmet'
import Relay from 'react-relay'
import R from 'ramda'
import MainGrid from 'components/shared/MainGrid';
import Project from './Project'

export const Projects = ({ viewer: { repositories } }) => (
  <MainGrid>
    <Helmet
      title="Projects"
      meta={[
        { name: 'description', content: 'Description of Projects' },
      ]}
    />
    {
      R.pipe(
        R.path(['edges']),
        R.map(R.prop('node')),
        R.sortWith([
          R.descend(R.prop('createdAt')),
        ]),
        R.map(node => <Project key={node.id} project={node} />),
      )(repositories)
    }
  </MainGrid>
)

Projects.propTypes = {
  viewer: PropTypes.object,
}

export default Relay.createContainer(Projects, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        repositories(first: 10) {
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
