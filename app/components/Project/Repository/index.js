import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import { compose, mapProps } from 'recompose';
import asyncComponent from 'utils/asyncComponent';
import { withRouter, Switch, Route } from 'react-router-dom';
import { matchRoute, matchName } from 'utils/routeMatcher';
import { codeRoute } from './routes';
import { MainContainer, HeightDiv, LoadingDiv } from './styles'

const Repository = ({ vars }) => (
  <QueryRenderer
    environment={env}
    variables={vars}
    query={query}
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
          <MainContainer>
            <Switch>
              {codeRoute.map((route, index) => {
                // eslint-disable-next-line
                const Component = asyncComponent(() => import(`./${route.name}/index`));
                const variables = { repository };
                return (
                  <Route
                    key={`codeComponent${index}`} // eslint-disable-line
                    path={route.path}
                    render={() => <Component {...variables} />}
                  />
                );
              })}
            </Switch>
          </MainContainer>
        );
      }
      return <HeightDiv><LoadingDiv><LoadingIndicator /></LoadingDiv></HeightDiv>;
    }}
  />
);

const query = graphql`
  query RepositoryQuery(
    $userName: String!, $projectName: String!, $sort: String!,
    $branchHead: String!, $splat: String, $commitId: String!,
    $isMainContainer: Boolean!, $isBranches: Boolean!, $isCommits: Boolean!,
    $isStashes: Boolean!, $isCommit: Boolean!, $isBlob: Boolean!, $isTree: Boolean!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        id
        ...Commit_repository
        ...Commits_repository
        ...Branches_repository
        ...BlobContainer_repository
        ...TreeContainer_repository
        ...MainContainer_repository
        ...PendingContributions_repository
      }
    }
  }
`;


Repository.propTypes = {
  viewer: PropTypes.object,
  vars: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  mapProps(({
    location: { pathname },
  }) => {
    const childName = matchName(pathname)
    const params = matchRoute(pathname).params;
    return ({
      vars: {
        userName: params.userName,
        projectName: params.projectName,
        branchHead: params.branchHead || 'master',
        commitId: params.commitId || '',
        splat: params['0'] || null,
        sort: 'popular',
        isMainContainer: childName === 'MainContainer',
        isTree: childName === 'TreeContainer',
        isBlob: childName === 'BlobContainer',
        isCommits: childName === 'Commits',
        isCommit: childName === 'Commit',
        isStashes: childName === 'PendingContributions',
        isBranches: childName === 'Branches',
      },
    });
  })
)(Repository);
