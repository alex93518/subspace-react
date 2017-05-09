import React from 'react'
import Relay from 'react-relay/classic'
import CurrentRelay from './CurrentRelay'

export const RelayRenderer = ({
  environment = CurrentRelay.Store,
  defaultLoadingProps,
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
