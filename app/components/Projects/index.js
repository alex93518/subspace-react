import React, { PropTypes } from 'react'
import Relay from 'react-relay'
import Helmet from 'react-helmet'
import MainGrid from 'components/shared/MainGrid';
import ProjectList from './ProjectList'

export const Projects = ({ viewer }) => (
  <MainGrid>
    <Helmet
      title="Projects"
      meta={[
        { name: 'description', content: 'Description of Projects' },
      ]}
    />
    <ProjectList viewer={viewer} />
  </MainGrid>
)

Projects.propTypes = {
  viewer: PropTypes.object,
}

export default Relay.createContainer(Projects, {
  initialVariables: {
    owner: null,
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${ProjectList.getFragment('viewer')}
      }
    `,
  },
})
