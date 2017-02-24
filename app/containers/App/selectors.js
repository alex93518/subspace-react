import { createSelector } from 'reselect';

// makeSelectLocationState expects a plain JS object for the routing state
const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export {
  makeSelectLocationState,
};

const selectAuthDomain = () => (state) => state.get('auth');

const makeSelectAuth = () => createSelector(
  selectAuthDomain(),
  (substate) => substate.toJS()
);

export default makeSelectAuth;
export {
  selectAuthDomain,
};
