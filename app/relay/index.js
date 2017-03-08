import Relay from 'react-relay';
import { getToken } from 'utils/firebase';
import {
  RelayNetworkLayer,
  urlMiddleware,
  authMiddleware,
} from 'react-relay-network-layer';

const getCustomNetworkLayer = token => new RelayNetworkLayer(
  [
    urlMiddleware({
      url: () => 'http://localhost:9000/auth/graphql',
    }),
    authMiddleware({
      token,
      prefix: '',
      header: 'f_base',
      tokenRefreshPromise: getToken,
    }),
  ],
  { disableBatchQuery: true }
)

class CurrentRelay {
  constructor() {
    this.Store = this.reset()
  }

  reset = async cb => {
    const env = new Relay.Environment()
    const token = await getToken

    env.injectNetworkLayer(getCustomNetworkLayer(token))
    this.Store = env
    if (cb) cb()
  }
}

export * from './queries'
export * from './mutations'

export default new CurrentRelay()
