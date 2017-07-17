import React from 'react'
import { object } from 'prop-types'
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

// TODO: move into separate module
const containerMap = {}
const getContainerByName = (name, Loaded) => {
  if (containerMap[name]) {
    return containerMap[name]
  }

  function Test(...args) {
    return Loaded.apply(this, args)
  }

  Test.prototype = Loaded.prototype
  for (const prop in Loaded) { // eslint-disable-line
    if (Loaded.hasOwnProperty(prop)) { // eslint-disable-line
      Test[prop] = Loaded[prop]
    }
  }

  containerMap[name] = Test
  return Test
}

// Create reusable async injectors using getAsyncInjectors factory
const { injectReducer, injectSagas } = getAsyncInjectors(store)

const loadModule = (path, relayOptions = {}, injectables = []) => async () => {
  try {
    const { query, name, prepareVariables = identity } = relayOptions
    const [component, reducer, sagas] = await Promise.all([
      import(`components/${path}/index`),
      ...injectables.map(module => import(`components/${path}/${module}`)),
    ]);

    if (reducer) injectReducer('projects', reducer.default)
    if (sagas) injectSagas(sagas.default)

    // If query is passed wrap loaded component in RelayRenderer
    if (query) {
      class RouteCreator extends React.Component {
        componentWillMount() {
          const CustomRoute = createRoute(query, name)
          const splat = Object.keys(this.props.match.params)
            .map(Number)
            .filter(Number.isInteger)
            // eslint-disable-next-line no-param-reassign
            .reduce((acc, key) => acc += this.props.match.params[key], '')


          this.container = getContainerByName(name, component.default)
          this.route = new CustomRoute(
            prepareVariables({
              splat: splat || null,
              ...this.props.match.params,
            })
          )
        }

        render() {
          return (
            <RelayRenderer
              {...this.props}
              Container={this.container}
              queryConfig={this.route}
            />
          )
        }
      }

      RouteCreator.propTypes = {
        match: object,
      }

      return RouteCreator
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
    component: Loadable('HomePage', { name: 'home' }),
  },
  {
    path: '/about',
    component: Loadable('About', { name: 'about' }),
  },
  {
    path: '/howitworks',
    component: Loadable('HowItWorks', { name: 'howItWorks' }),
  },
  {
    path: '/login',
    component: Loadable('Login', { name: 'login' }),
  },
  {
    path: '/profile/:userName',
    component: Loadable('UserProfile', {
      query: viewerQuery,
      name: 'userProfile',
    }),
  },
  {
    path: '/createproject',
    component: Loadable('CreateProject', { name: 'createProject' }),
  },
  {
    path: '/projects',
    component: Loadable('Projects', {
      query: viewerQuery,
      name: 'projects',
    }, ['reducer']),
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
    path: '/:userName/:projectName/:branchHead/stash/:stashNum',
    component: Loadable('Project', {
      query: viewerQuery,
      name: 'Stash',
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
