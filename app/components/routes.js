import React from 'react'
import { identity } from 'ramda'
import Relay from 'react-relay/classic'
import ReactLoadable from 'react-loadable'
import store from 'store'
import { viewerQuery } from 'relay/queries'
import { RelayRenderer } from 'relay/RelayRenderer'
import { getAsyncInjectors } from 'utils/asyncInjectors'

const createRoute = (query, routeName) => class Route extends Relay.Route {
  static queries = { ...query }
  static routeName = routeName || 'route_name'
}

// Create reusable async injectors using getAsyncInjectors factory
const { injectReducer, injectSagas } = getAsyncInjectors(store)

const loadModule = (path, { query, name, prepareVariables = identity } = {}, injectables = []) => async () => {
  try {
    const [component, reducer, sagas] = await Promise.all([
      import(`components/${path}/index`),
      ...injectables.map(module => import(`components/${path}/${module}`)),
    ]);

    if (reducer) injectReducer('projects', reducer.default)
    if (sagas) injectSagas(sagas.default)

    // If query is passed wrap loaded component in RelayRenderer
    if (query) {
      return class RouteCreator extends React.Component {
        componentWillMount() {
          const CustomRoute = createRoute(query, name)
          const splat = Object.keys(this.props.match.params)
            .map(Number)
            .filter(Number.isInteger)
            .reduce((acc, key) => acc += this.props.match.params[key], '')

          this.route = new CustomRoute(
            prepareVariables({
              splat: splat || null,
              ...this.props.match.params
            }))
        }

        render() {
          return (
            <RelayRenderer
              Container={component.default}
              queryConfig={this.route}
              {...this.props}
            />
          )
        }
      }
    }

    return component.default
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Dynamic loading of "components/${path}" failed`, err)
    return null
  }
}

const Loadable = (path, injectables) => ReactLoadable({
  LoadingComponent: () => null,
  loader: injectables
    ? loadModule(path, injectables)
    : () => import(`components/${path}/index`),
})

export default [
  {
    path: '/',
    exact: true,
    name: 'home',
    component: Loadable('HomePage'),
  },
  {
    path: '/about',
    name: 'about',
    component: Loadable('About'),
  },
  {
    path: '/howitworks',
    name: 'howItWorks',
    component: Loadable('HowItWorks'),
  },
  {
    path: '/login',
    name: 'login',
    component: Loadable('Login'),
  },
  {
    path: '/profile/:login',
    name: 'userProfile',
    component: Loadable('UserProfile', { query: viewerQuery }),
  },
  {
    path: '/createproject',
    name: 'createProject',
    component: Loadable('CreateProject'),
  },
  {
    path: '/projects',
    name: 'projects',
    component: Loadable('Projects', { query: viewerQuery }, ['reducer']),
  },
  {
    path: '/:userName/:projectName/:branchHead/tree/**',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'Tree',
    }),
  },
  {
    path: '/:userName/:projectName/:branchHead/blob/**',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'Blob',
    }),
  },
  {
    path: '/:userName/:projectName/:branchHead/commits',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'Commits',
    }),
  },
  {
    path: '/:userName/:projectName/:branchHead/commits/**',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'Commits',
    }),
  },
  {
    path: '/:userName/:projectName/:branchHead/commit/:commitId',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'Commit',
    }),
  },
  {
    path: '/:userName/:projectName/:branchHead/stashes',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'Stashes',
    }),
  },
  {
    path: '/:userName/:projectName/branches',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'Branches',
    }),
  },
  {
    path: '/:userName/:projectName/:branchHead',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'MainContainer',
      prepareVariables: vars => ({ ...vars, splat: null }),
    }),
  },
  {
    path: '/:userName/:projectName',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'MainContainer',
      prepareVariables: vars => ({
        ...vars,
        splat: null,
        branchHead: 'master',
      }),
    }),
  },
  {
    path: '*',
    name: 'notfound',
    component: Loadable('NotFoundPage'),
  },
]
