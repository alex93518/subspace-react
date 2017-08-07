const fs = require('fs');
const introspectionQuery = require('graphql/utilities').introspectionQuery;
const request = require('sync-request');

const graphqlEndpoint = (
  process.env.RELAY_PLUGIN_URL ||
  'http://localhost:9000/graphql'
);

try {
  const response = request('POST', graphqlEndpoint, {
    json: {
      query: introspectionQuery,
    },
  });

  const schemaString = response.body.toString('utf-8');
  fs.writeFileSync('schema.json', schemaString);
} catch (err) {
  console.log('Using local schema.json file');
}
