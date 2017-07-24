import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Switch, Route } from 'react-router-dom';
import { codeRoute } from './routes';

const Repository = ({ repository }) => (
  <Switch>
    {codeRoute.map((route, index) => {
      // eslint-disable-next-line
      const Component = require(`./${route.name}/index`).default;
      const variables = {
        [route.name.charAt(0).toLowerCase() + route.name.slice(1)]: repository,
      };
      return (
        <Route
          key={`codeComponent${index}`} // eslint-disable-line
          path={route.path}
          render={() => <Component {...variables} />}
        />
      );
    })}
  </Switch>
);

Repository.propTypes = {
  repository: PropTypes.object.isRequired,
};

export default createFragmentContainer(Repository, {
  repository: graphql`
    fragment Repository_repository on Repository {
      id
      ...Stash_stash
      ...Stashes_stashes
      ...Commit_commit
      ...Commits_commits
      ...Branches_branches
      ...BlobContainer_blobContainer
      ...TreeContainer_treeContainer
      ...MainContainer_mainContainer
    }
  `,
});
