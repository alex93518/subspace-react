import { createAction } from 'redux-act'

export const dispatchRef = {
  // Temp dispatch that will be replaced with a real one
  dispatch: () => {},
}

const dispatch = (...args) => dispatchRef.dispatch(...args)
const fakeStore = { dispatch }

export const createActionBinded = (...args) => (
  createAction(...args).assignTo(fakeStore)
)

export default dispatch
