import { push } from 'react-router-redux'
import dispatch from './dispatch'

export const redirect = (...args) => dispatch(push(...args))
