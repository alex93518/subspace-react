import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';

let headers = {
  'Content-Type': 'application/json',
};

export const resetEnv = (provider = null, token = null) => {
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

  env = new Environment({
    network,
    store: new Store(new RecordSource()),
  });
};

function fetchQuery(
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
  }).then(response => response.json(), error => {
    throw error;
  });
}

export const network = Network.create(fetchQuery);

export let env = new Environment({ // eslint-disable-line
  network,
  store: new Store(new RecordSource()),
});
