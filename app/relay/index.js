import Relay from 'react-relay';
import { RelayNetworkLayer, urlMiddleware } from 'react-relay-network-layer';

const tokenMiddleware = ({ token } = {}) => (
  next => req => {
    Object.assign(req.headers, {
      f_base: token,
    });

    return next(req);
  }
)

const getCustomNetworkLayer = token => new RelayNetworkLayer(
  [
    urlMiddleware({
      url: () => 'http://localhost:9000/auth/graphql',
    }),
    tokenMiddleware({
      token,
    }),
  ],
  { disableBatchQuery: true }
)

class CurrentRelay {
  constructor() {
    this.Store = this.refresh()
  }

  refresh(token = '') {
    const env = new Relay.Environment()
    env.injectNetworkLayer(getCustomNetworkLayer(token))
    this.Store = env
  }
}

export default new CurrentRelay()
