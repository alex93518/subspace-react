import store from 'store'
import { getAsyncInjectors } from 'utils/asyncInjectors';
import { viewerQuery } from 'relay/queries';

const errorLoading = err => {
  // eslint-disable-next-line no-console
  console.error('Dynamic page loading failed', err);
}

const loadModule = cb => componentModule => {
  cb(null, componentModule.default);
}

// Create reusable async injectors using getAsyncInjectors factory
const { injectReducer, injectSagas } = getAsyncInjectors(store)

export default [
  {
    path: '/',
    name: 'home',
    getComponent(nextState, cb) {
      const importModules = Promise.all([import('components/HomePage')]);

      const renderRoute = loadModule(cb);

      importModules.then(([component]) => {
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
  },
  {
    path: '/projects',
    name: 'projects',
    getComponent(nextState, cb) {
      const importModules = Promise.all([
        import('components/Projects/reducer'),
        import('components/Projects/sagas'),
        import('components/Projects'),
      ]);

      const renderRoute = loadModule(cb);

      importModules.then(([reducer, sagas, component]) => {
        injectReducer('projects', reducer.default);
        injectSagas(sagas.default);
        renderRoute(component);
      });

      importModules.catch(errorLoading);
    },
    queries: viewerQuery,
  },
  {
    path: '/about',
    name: 'about',
    getComponent(location, cb) {
      import('components/About').then(loadModule(cb)).catch(errorLoading);
    },
  },
  {
    path: '/howitworks',
    name: 'howItWorks',
    getComponent(location, cb) {
      import('components/HowItWorks').then(loadModule(cb)).catch(errorLoading);
    },
  },
  {
    path: '/login',
    name: 'login',
    getComponent(location, cb) {
      import('components/Login').then(loadModule(cb)).catch(errorLoading);
    },
  },
  {
    path: '/profile/:userName',
    name: 'userProfile',
    getComponent(location, cb) {
      import('components/UserProfile').then(loadModule(cb)).catch(errorLoading);
    },
    queries: viewerQuery,
  },
  {
    path: '/createproject',
    name: 'createProject',
    getComponent(location, cb) {
      import('components/CreateProject')
        .then(loadModule(cb))
        .catch(errorLoading);
    },
  }, {
    path: '*',
    name: 'notfound',
    getComponent(nextState, cb) {
      import('components/NotFoundPage').then(loadModule(cb)).catch(errorLoading);
    },
  },
]
