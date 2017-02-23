
import { fromJS } from 'immutable';
import projectsReducer from '../reducer';

describe('projectsReducer', () => {
  it('returns the initial state', () => {
    expect(projectsReducer(undefined, {})).toEqual(fromJS({}));
  });
});
