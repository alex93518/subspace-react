import Relay from 'react-relay';
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-layer';

let instance = null;

const tokenMiddleware = (opts = { token }) => {
  const token = opts.token;
  return next => req => {
    Object.assign(req.headers, {
      ...req.headers,
      f_base: token,
    });
    const resPromise = next(req);
    return resPromise;
  };
}

const getCustomNetworkLayer = token => {
  const network = new RelayNetworkLayer([
    urlMiddleware({
      url: () => 'http://localhost:9000/auth/graphql',
    }),
    tokenMiddleware({
      token,
    }),
  ], { disableBatchQuery: true });
  return network
};

const refresh = token => {
  instance = new Relay.Environment();
  instance.injectNetworkLayer(getCustomNetworkLayer(token));
  return instance;
};

const getInstance = () => (instance || refresh(''));

export default {
  getCurrent: getInstance.bind(this),
  refresh: refresh.bind(this),
};
