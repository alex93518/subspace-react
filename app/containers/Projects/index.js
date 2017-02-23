import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import Relay from 'react-relay';
import makeSelectProjects from './selectors';
import Project from '../../components/Project';

export class Projects extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { projects } = this.props;
    return (
      <div>
        <Helmet
          title="Projects"
          meta={[
            { name: 'description', content: 'Description of Projects' },
          ]}
        />
        {projects.map((project) => <Project project={project} />)}
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

function mapDispatchToProps() {
  return null;
}

const ProjectsPage = connect(mapStateToProps, mapDispatchToProps)(Projects);

export default Relay.createContainer(
  ProjectsPage,
  {
    fragments: {
      projects: () => Relay.QL`
        fragment on Project @relay(plural: true) {
          projects(pageStart: 0, pageEnd:9) {
            ${Project.getFragment('project')}
          }
        }
      `,
    },
  },
);
