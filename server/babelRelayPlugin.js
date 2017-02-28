const fs = require('fs')
const getBabelRelayPlugin = require('babel-relay-plugin')
const introspectionQuery = require('graphql/utilities').introspectionQuery
const request = require('sync-request')

const graphqlEndpoint = process.env.GRAPHQL_ENDPOINT || 'http://localhost:9000/graphql'
const response = request('POST', graphqlEndpoint, {
  json: {
    query: introspectionQuery,
  },
})

const schemaString = response.body.toString('utf-8')
const schema = JSON.parse(schemaString)
fs.writeFileSync('schema.json', schemaString)

module.exports = {
  plugins: [getBabelRelayPlugin(schema.data, { abortOnError: true })],
}
