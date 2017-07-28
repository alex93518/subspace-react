import { createFragmentContainer } from 'react-relay';

export default fragmentOptions => Component => (
  createFragmentContainer(Component, fragmentOptions)
);
