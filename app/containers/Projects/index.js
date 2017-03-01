import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Relay from 'react-relay';
import Project from '../../components/projects/Project';

export const Projects = ({ viewer: { projects, userName } }) => (
  <div>
    <Helmet
      title="Projects"
      meta={[
        { name: 'description', content: 'Description of Projects' },
      ]}
    />
    <div>Viewer: {userName}</div>
    {projects.edges.map(({ node }) =>
      <Project key={node.id} project={node} />
    )}
  </div>
)

Projects.propTypes = {
  viewer: PropTypes.object,
};

export default Relay.createContainer(Projects, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on ViewerQuery {
        userName,
        fullName,
        projects(first: 10) {
          edges {
            node {
              id,
              ${Project.getFragment('project')}
            }
          }
        }
      }
    `,
  },
});
