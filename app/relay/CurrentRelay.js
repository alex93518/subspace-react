import Relay from 'react-relay/classic'
import { getToken } from 'utils/firebase'
import {
  RelayNetworkLayer,
  urlMiddleware,
  authMiddleware,
  loggerMiddleware, // eslint-disable-line
} from 'utils/react-relay-network-layer'

window.graph_url = process.env.GRAPHQL_ENDPOINT

const getCustomNetworkLayer = (token, provider) => new RelayNetworkLayer(
  [
    urlMiddleware({
      url: () => (
        process.env.GRAPHQL_ENDPOINT ||
        'http://subspace-api.nqfviyftp5.us-east-1.elasticbeanstalk.com/graphql'
      ),
    }),
    // loggerMiddleware(),
    authMiddleware({
      token,
      prefix: '',
      header: provider === 'firebase' ? 'fbase' : 'stexch',
      tokenRefreshPromise: getToken,
    }),
  ],
  { disableBatchQuery: true },
  next => req => {
    req.credentials = 'same-origin'
    return next(req)
  },
)

class CurrentRelay {
  reset = async (cb, provider = 'firebase', accessToken = '') => {
    const env = new Relay.Environment()
    const token = accessToken || await getToken()
    env.injectNetworkLayer(getCustomNetworkLayer(token, provider))
    // TODO: remove window binding before pushing to production
    window.Store = this.Store = env
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

export default new CurrentRelay()
