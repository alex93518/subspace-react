import { createRefetchContainer } from 'react-relay';

const withRelayRefetch = (refetchOptions, refetchQuery) => Component => createRefetchContainer(Component, refetchOptions, refetchQuery)

export default withRelayRefetch
