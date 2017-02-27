import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import Relay from 'react-relay';
import makeSelectProjects from './selectors';
import Project from '../../components/projects/Project';

export class Projects extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const projects = this.props.projects.edges;
    return (
      <div>
        <Helmet
          title="Projects"
          meta={[
            { name: 'description', content: 'Description of Projects' },
          ]}
        />
        {projects.map(project => <Project project={project.node} key={project.node.id} />)}
      </div>
    );
  }
}

Projects.propTypes = {
  projects: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  Projects: makeSelectProjects(),
});

const ProjectsPage = connect(mapStateToProps, null)(Projects);

export default Relay.createContainer(
  ProjectsPage,
  {
    fragments: {
      projects: () => Relay.QL`
        fragment on ProjectConnection {
          edges {
            node {
              id,
              ${Project.getFragment('project')}
            }
          }
        }
      `,
    },
  },
);
