import Relay from 'react-relay/classic'
import toClass from 'recompose/toClass'
import createHelper from 'recompose/createHelper'

const createContainerFn = options => BaseComponent =>
  Relay.createContainer(toClass(BaseComponent), options)

export const createContainer = createHelper(
  createContainerFn,
  'createContainer',
  false
)
