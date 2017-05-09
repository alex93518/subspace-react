import React from 'react'
import { identity } from 'ramda'
import { object, func } from 'prop-types'
import { QueryRenderer as Renderer } from 'react-relay/compat'
import CurrentRelay from './CurrentRelay'

export const withQueryRenderer = ({ query }) => Component => {
  const QueryRenderer = ({ match, prepareVariables = identity, ...rest }) => (
    <Renderer
      environment={CurrentRelay.Store}
      query={query}
      variables={prepareVariables(match.params)}
      render={({ error, props }) => {
        if (error) {
          return <div>{error.message}</div>
        } else if (props) {
          return <Component {...props} {...rest} />
        }

        return <div>Loading</div>
      }}
    />
  )

  QueryRenderer.propTypes = {
    match: object,
    prepareVariables: func,
  }

  return QueryRenderer
}

export default withQueryRenderer
