import store from 'store'
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { viewerQuery } from 'relay/queries';

// Create reusable async injectors using getAsyncInjectors factory
const { injectReducer, injectSagas } = getAsyncInjectors(store)

const loadModule = (path, injectables = []) => async (nextState, cb) => {
  try {
    const [component, reducer, sagas] = await Promise.all([
      import(`components/${path}/index`),
      ...injectables.map(module => import(`components/${path}/${module}`)),
    ]);

    if (reducer) injectReducer('projects', reducer.default);
    if (sagas) injectSagas(sagas.default);

    cb(null, component.default);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Dynamic loading of "components/${path}" failed`, err);
  }
}

export default [
  {
    path: '/',
    name: 'home',
    getComponent: loadModule('HomePage'),
  },
  {
    path: '/about',
    name: 'about',
    getComponent: loadModule('About'),
  },
  {
    path: '/howitworks',
    name: 'howItWorks',
    getComponent: loadModule('HowItWorks'),
  },
  {
    path: '/login',
    name: 'login',
    getComponent: loadModule('Login'),
  },
  {
    path: '/profile/:userName',
    name: 'userProfile',
    getComponent: loadModule('UserProfile'),
    queries: viewerQuery,
  },
  {
    path: '/createproject',
    name: 'createProject',
    getComponent: loadModule('CreateProject'),
  },
  {
    path: '/projects',
    name: 'projects',
    getComponent: loadModule('Projects', ['reducer']),
    queries: viewerQuery,
  },
  {
    path: '/:userName/:projectName',
    name: 'project',
    getComponent: loadModule('Project'),
    queries: viewerQuery,
    prepareParams: ({ projectName, userName }) => ({
      name: projectName,
      owner: userName,
    }),
  },
  {
    path: '*',
    name: 'notfound',
    getComponent: loadModule('NotFoundPage'),
  },
]
