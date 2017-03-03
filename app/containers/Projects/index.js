import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import Relay from 'react-relay';
import makeSelectProjects from './selectors';
import Project from '../../components/projects/Project';

export class Projects extends React.Component { // eslint-disable-line react/prefer-stateless-function, max-len
  render() {
    const allProjects = this.props.viewer.allProjects.edges;
    const user = this.props.viewer.user
    console.log(this.props.viewer)
    return (
      <div>
        <Helmet
          title="Projects"
          meta={[
            { name: 'description', content: 'Description of Projects' },
          ]}
        />
        <div>Viewer: {user ? user.userName : null}</div>
        {allProjects.map(project =>
          <Project project={project.node} key={project.node.id} />
        )}
      </div>
    );
  }
}

Projects.propTypes = {
  viewer: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  Projects: makeSelectProjects(),
});

const ProjectsPage = connect(mapStateToProps, null)(Projects);

export default Relay.createContainer(
  ProjectsPage,
  {
    fragments: {
      viewer: () => Relay.QL`
        fragment on ViewerQuery {
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
  },
);
