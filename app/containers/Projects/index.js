import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import Relay from 'react-relay';
import makeSelectProjects from './selectors';
import Project from '../../components/projects/Project';

export class Projects extends React.Component { // eslint-disable-line react/prefer-stateless-function, max-len
  render() {
    const projects = this.props.viewer.projects.edges;
    const userName = this.props.viewer.userName
    return (
      <div>
        <Helmet
          title="Projects"
          meta={[
            { name: 'description', content: 'Description of Projects' },
          ]}
        />
        <div>Viewer: {userName}</div>
        {projects.map(project =>
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
  },
);
