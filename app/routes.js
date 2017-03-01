import { getAsyncInjectors } from 'utils/asyncInjectors';
import { viewerQuery, userByNameQuery } from './relay/queries';

const errorLoading = err => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = cb => componentModule => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([import('containers/HomePage')]);

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
          import('containers/Projects/reducer'),
          import('containers/Projects/sagas'),
          import('containers/Projects'),
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
        import('containers/About').then(loadModule(cb)).catch(errorLoading);
      },
    },
    {
      path: '/howitworks',
      name: 'howItWorks',
      getComponent(location, cb) {
        import('containers/HowItWorks').then(loadModule(cb)).catch(errorLoading);
      },
    },
    {
      path: '/login',
      name: 'login',
      getComponent(location, cb) {
        import('containers/Login').then(loadModule(cb)).catch(errorLoading);
      },
    },
    {
      path: '/profile/:userName',
      name: 'userProfile',
      getComponent(location, cb) {
        import('containers/UserProfile').then(loadModule(cb)).catch(errorLoading);
      },
      queries: userByNameQuery,
    },
    {
      path: '/createproject',
      name: 'createProject',
      getComponent(location, cb) {
        import('containers/CreateProject')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage').then(loadModule(cb)).catch(errorLoading);
      },
    },
  ];
}
