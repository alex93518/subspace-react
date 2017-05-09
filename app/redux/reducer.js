import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import authReducer from 'redux/auth/reducer'

export default function createReducer(asyncReducers) {
  return combineReducers({
    route: routerReducer,
    auth: authReducer,
    form: formReducer,
    ...asyncReducers,
  })
}
