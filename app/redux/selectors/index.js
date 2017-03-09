import { createSelector } from 'reselect';

// makeSelectLocationState expects a plain JS object for the routing state
export const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return state => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export const selectAuthDomain = () => state => state.get('auth');

export const makeSelectAuth = () => createSelector(
  selectAuthDomain(),
  substate => substate.toJS()
);
