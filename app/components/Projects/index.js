import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Relay from 'react-relay';
import Project from './Project';

export const Projects = ({ viewer: { allProjects, user } = {} }) => (
  <div>
    <Helmet
      title="Projects"
      meta={[
        { name: 'description', content: 'Description of Projects' },
      ]}
    />
    {
      user &&
      <div>Viewer: {user.userName}</div>
    }
    {allProjects && allProjects.edges.map(({ node }) =>
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
      fragment on Viewer {
        user {
          userName
        },
        allProjects(first: 10) {
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
