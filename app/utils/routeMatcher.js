import { matchPath } from 'react-router';
import { codeRoute } from 'components/Project/Repository/routes';

export const matchRouteBase = (path, baseRoute) => {
  const paths = baseRoute.map(route =>
    matchPath(path, route)
  ).filter(matchingPath => matchingPath !== null);
  if (paths.length > 0) {
    return paths[0];
  }
  return null;
};

export const matchNameBase = (path, baseRoute) => {
  const getPath = matchRouteBase(path, baseRoute);
  if (getPath != null) {
    return baseRoute.filter(route => route.path === getPath.path)[0].name;
  }
  return null;
};

export const matchRoute = path => matchRouteBase(path, codeRoute);
export const matchName = path => matchNameBase(path, codeRoute);
