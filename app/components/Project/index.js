import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import { matchRoute } from 'utils/routeMatcher';
import Repository from './Repository';
import TopContainer from './TopContainer';
import { HeightDiv } from './styles'
import TopAppBar from './TopAppBar'

const Project = ({ vars }) => (
  <QueryRenderer
    environment={env}
    variables={vars}
    query={topQuery}
    render={({ error, props }) => {
      if (error) {
        throw error;
      } else if (props) {
        const {
          viewer: {
            repository,
          },
        } = props;
        return (
          repository &&
          <HeightDiv>
            <TopAppBar />
            <TopContainer repository={repository} />
            <Repository />
          </HeightDiv>
        );
      }
      return <LoadingIndicator />;
    }}
  />
);

Project.propTypes = {
  viewer: PropTypes.object,
  vars: PropTypes.object.isRequired,
}

const topQuery = graphql`
  query ProjectQuery(
    $userName: String!, $projectName: String!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        ...TopContainer_repository
      }
    }
  }
`;

export default compose(
  withRouter,
  mapProps(({
    location: { pathname },
  }) => {
    const params = matchRoute(pathname).params;
    return ({
      vars: {
        userName: params.userName,
        projectName: params.projectName,
      },
    });
  })
)(Project);
