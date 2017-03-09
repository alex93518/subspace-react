import Relay from 'react-relay';
import { getToken } from 'utils/firebase';
import {
  RelayNetworkLayer,
  urlMiddleware,
  authMiddleware,
  loggerMiddleware, // eslint-disable-line
} from 'react-relay-network-layer';

const getCustomNetworkLayer = token => new RelayNetworkLayer(
  [
    urlMiddleware({
      url: () => process.env.GRAPHQL_ENDPOINT,
    }),
    // loggerMiddleware(),
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
  reset = async cb => {
    const env = new Relay.Environment()
    const token = await getToken()

    env.injectNetworkLayer(getCustomNetworkLayer(token))
    this.Store = env
    if (cb) cb()
  }

  fetch = ({ query, force }) => new Promise((resolve, reject) => {
    const args = [
      { query },
      ({ done, error }) => {
        if (done) {
          resolve(this.Store.readQuery(query)[0] || {})
        }

        if (error) {
          reject(error)
        }
      },
    ]

    force
      ? this.Store.forceFetch(...args)
      : this.Store.primeCache(...args)
  })
}

export * from './queries'
export * from './mutations'

export default new CurrentRelay()
