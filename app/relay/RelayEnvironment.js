import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { firebaseAuth, firebaseDb, firebaseApp, getToken } from 'utils/firebase';
import { actionsGenerator, redirect } from 'redux/utils';
import { selectAuthDomain } from 'redux/selectors';
import { call, select } from 'redux-saga/effects';
import { commitMutation, graphql } from 'react-relay';
// eslint-disable-next-line
import RelayQueryResponseCache from 'relay-runtime/lib/RelayQueryResponseCache.js';

const cache = new RelayQueryResponseCache({ size: 250, ttl: 60 * 5 * 1000 });

const mutation = graphql`
  mutation RelayEnvironmentMutation($input: SetIsInvisibleInput!) {
    setIsInvisible(input: $input) {
      clientMutationId
    }
  }
`;

export const setIsInvisibleMutation = ({
  isInvisible,
  isNetwork,
  ...rest
}) => {
  const input = {
    isInvisible,
  };

  if (isNetwork) {
    return network.fetch(mutation(), { input });
  }

  return commitMutation(
    env,
    {
      mutation,
      variables: { input },
      onCompleted: rest.onCompleted || (() => null),
      onError: rest.onError || (err => console.error(err)),
    },
  );
};

// Move signOut outside authActions to prevent circular dependency
function* signOut() {
  yield call(removeUserPresence)
  yield call([firebaseAuth, firebaseAuth.signOut])
  yield call(redirect, '/login')
  yield call(resetEnv, null, null)
}

function* getCurrentName() {
  const selectUser = selectAuthDomain()
  const user = yield select(selectUser);
  const userName = user.get('userName')
  return userName
}

export function* addUserPresence(userName = null) {
  let name = userName
  if (!name) {
    name = yield call(getCurrentName)
  }

  let connectionRef;
  const onConnectedValue = snap => {
    const online = snap.val();
    if (!online) return;
    if (connectionRef) connectionRef.remove();
    connectionRef = firebaseDb.ref(`users-presence/${name}`).push({
      lastSeenAt: firebaseApp.database.ServerValue.TIMESTAMP,
    });
    connectionRef.onDisconnect().remove();
  };
  firebaseDb.ref('.info/connected').on('value', onConnectedValue);
}

export function* removeUserPresence() {
  const name = yield call(getCurrentName)
  const connectionRef = firebaseDb.ref(`users-presence/${name}`)
  if (connectionRef) connectionRef.remove()
  firebaseDb.ref('.info/connected').off()
}

export function* setIsInvisible({ payload }) {
  if (payload) {
    yield call(removeUserPresence)
  } else {
    yield call(addUserPresence)
  }

  yield call(setIsInvisibleMutation, {
    isInvisible: payload,
  })
  return payload
}

export const authRelay = actionsGenerator({
  signOut,
  addUserPresence,
  removeUserPresence,
  setIsInvisible,
})

let headers = {
  'Content-Type': 'application/json',
};

const changeHeaders = (provider = null, token = null) => {
  if (provider !== null && token !== null) {
    const localHeaders = {
      'Content-Type': 'application/json',
    };
    const tokenName = provider === 'firebase' ? 'fbase' : 'stexch';
    localHeaders[tokenName] = token;
    headers = localHeaders;
  } else {
    headers = {
      'Content-Type': 'application/json',
    };
  }
}

export const resetEnv = (provider = null, token = null) => {
  changeHeaders(provider, token);
  env = new Environment({
    network,
    store: new Store(new RecordSource()),
  });
};

function baseFetchQuery(
  operation,
  variables,
) {
  let queryID = null;

  if (operation.name === 'ProjectQuery') {
    queryID = JSON.stringify(variables)
    const data = cache.get(queryID, variables);
    if (data !== null) return { data }; // cache hit
  }

  const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || 'http://localhost:9000/graphql';
  return fetch(graphqlEndpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(
    response => new Promise(
      res => setTimeout(res, 0)
    ).then(() => {
      if (response.status === 401) {
        alert('Unauthorized access. Login first. TODO: Change this alert to modal');
        redirect('/login');
      }

      return response.json()
    })
  ).then(
    jsonPayload => {
      if (jsonPayload.data) {
        cache.set(queryID, variables, jsonPayload.data);
      }
      return jsonPayload;
    }
  ).catch(
    err => {
      throw err;
    }
  )
}

const fetchQuery = async (operation, variables) => {
  if (headers.fbase) {
    const tokenRefresh = await getToken()
    if (tokenRefresh) {
      changeHeaders('firebase', tokenRefresh)
    } else {
      authRelay.signOut.init()
    }
  }

  return baseFetchQuery(operation, variables)
}

export const network = Network.create(fetchQuery);

export let env = new Environment({ // eslint-disable-line
  network,
  store: new Store(new RecordSource()),
});
