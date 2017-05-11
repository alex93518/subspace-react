import React from 'react'
import { object, func } from 'prop-types'
import Relay from 'react-relay/classic'
import CurrentRelay from './CurrentRelay'

export const RelayRenderer = ({
  environment = CurrentRelay.Store,
  renderLoading,
  renderFetched,
  renderFailure,
  queryConfig,
  Container,
  ...rest
}) => (
  <Relay.Renderer
    Container={Container}
    environment={environment}
    queryConfig={queryConfig}
    render={({ error, props }) => {
      if (props) {
        return renderFetched
          ? renderFetched(props)
          : <Container {...props} />
      }

      if (error && renderFailure) {
        return renderFailure(error)
      }

      if (renderLoading) {
        return renderLoading()
      }

      return null
    }}
    {...rest}
  />
)

RelayRenderer.propTypes = {
  environment: object,
  renderLoading: func,
  renderFetched: func,
  renderFailure: func,
  queryConfig: object,
  Container: func,
}
