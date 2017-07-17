import React from 'react'
import { object, func } from 'prop-types'
import styled from 'styled-components'
import Relay from 'react-relay/classic'
import Spinner from 'react-spinkit'
import CurrentRelay from './CurrentRelay'

const SpinnerContainer = styled.div`
  display: table;
  height: 600px;
  width: 100%;
`

const SpinnerDiv = styled.div`
  display: table-cell;
  vertical-align: middle;
  text-align: center;
`

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
      if (error) {
        if (renderFailure) {
          return renderFailure(error)
        }
        return <div>Error fetching data</div>
      }

      if (props) {
        return renderFetched
          ? renderFetched(props)
          : <Container {...props} />
      }

      if (renderLoading) {
        return renderLoading()
      }

      return (
        <SpinnerContainer>
          <SpinnerDiv>
            <h3>Loading ...</h3>
            <Spinner name="line-scale" color="goldenrod" />
          </SpinnerDiv>
        </SpinnerContainer>
      )
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
