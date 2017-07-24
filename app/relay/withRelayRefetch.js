import { createRefetchContainer } from 'react-relay';

export default refetchOptions => Component => (
  createRefetchContainer(Component, refetchOptions)
);
