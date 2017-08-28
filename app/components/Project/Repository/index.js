import React from 'react';
import PropTypes from 'prop-types';
import { compose, mapProps } from 'recompose';
import asyncComponent from 'utils/asyncComponent';
import { withRouter, Switch, Route } from 'react-router-dom';
import { matchRoute, matchName } from 'utils/routeMatcher';
import { codeRoute } from './routes';
import { MainContainer } from './styles'

const Repository = ({ vars }) => (
  <MainContainer>
    <Switch>
      {codeRoute.map((route, index) => {
        // eslint-disable-next-line
        const Component = asyncComponent(() => import(`./${route.name}/index`));
        return (
          <Route
            key={`codeComponent${index}`} // eslint-disable-line
            path={route.path}
            render={() => <Component vars={vars} />}
          />
        );
      })}
    </Switch>
  </MainContainer>
);

Repository.propTypes = {
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
        isStashes: childName === 'PendingContributions',
      },
    });
  })
)(Repository);
