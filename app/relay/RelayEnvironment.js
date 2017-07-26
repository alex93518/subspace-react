import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { firebaseAuth, getToken } from 'utils/firebase';
import { actionsGenerator, redirect } from 'redux/utils';
import { call } from 'redux-saga/effects';

// Move signOut outside authActions to prevent circular dependency
function* signOut() {
  yield call([firebaseAuth, firebaseAuth.signOut])
  yield call(resetEnv, null, null)
}

export const authSignout = actionsGenerator({
  signOut,
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
  return fetch('http://localhost:9000/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  }).then(
    response => {
      if (response.status === 401) {
        alert('Unauthorized. Login first. TODO: Change to modal');
        redirect('/login');
      }

      return response.json()
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
      authSignout.signOut.init()
    }
  }

  return baseFetchQuery(operation, variables)
}

export const network = Network.create(fetchQuery);

export let env = new Environment({ // eslint-disable-line
  network,
  store: new Store(new RecordSource()),
});
