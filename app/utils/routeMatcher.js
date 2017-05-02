export const routeName = route =>
  route.name.replace('_aggregated__', '').replace('__default_viewer', '')

export const matchRoute = (route, map) =>
  map[routeName(route)] ? map[routeName(route)]() : null;

export const matchRouteChild = (route, map, repository) =>
  map[routeName(route)] ?
    map[routeName(route)](repository, route.params) : null;
