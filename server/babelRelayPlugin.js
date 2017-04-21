const fs = require('fs')
const getBabelRelayPlugin = require('babel-relay-plugin')
const introspectionQuery = require('graphql/utilities').introspectionQuery
const request = require('sync-request')

let schema
const graphqlEndpoint = (
  process.env.RELAY_PLUGIN_URL ||
  'http://localhost:9000/graphql'
)

try {
  const response = request('POST', graphqlEndpoint, {
    json: {
      query: introspectionQuery,
    },
  })

  const schemaString = response.body.toString('utf-8')
  schema = JSON.parse(schemaString)
  fs.writeFileSync('schema.json', schemaString)
} catch (err) {
  schema = require('../schema.json') // eslint-disable-line global-require
}

module.exports = {
  plugins: [getBabelRelayPlugin(schema.data, { abortOnError: true })],
}
