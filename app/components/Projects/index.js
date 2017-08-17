import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet'
import { QueryRenderer, graphql } from 'react-relay';
import MainGrid from 'components/shared/MainGrid';
import { env } from 'relay/RelayEnvironment';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import ProjectList from './ProjectList'

const Projects = () => (
  <QueryRenderer
    environment={env}
    variables={{ owner: null }}
    query={graphql`
      query ProjectsQuery($owner: String) {
        viewer {
          ...ProjectList_viewer
        }
      }
    `}
    render={({ props }) => {
      if (props) {
        return (
          <MainGrid>
            <Helmet
              title="Projects"
              meta={[
                { name: 'description', content: 'Description of Projects' },
              ]}
            />
            <ProjectList viewer={props.viewer} />
          </MainGrid>
        )
      }
      return <LoadingIndicator />;
    }}
  />
);

Projects.propTypes = {
  viewer: PropTypes.object,
};

export default Projects;
