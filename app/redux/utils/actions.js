import { identity } from 'ramda'
import { createActionBinded } from 'redux/utils/dispatch'

export const INIT = 'init'
export const SUCCESS = 'success'
export const FAILURE = 'failure'

const createRequestStatusAction = (actionName, status) => (
  createActionBinded(`${actionName} ${status}`, identity, (_, payload) => ({
    type: actionName,
    requestStatus: status,
    ...payload,
  }))
)

export const createRequestActions = (
  actionName,
  requestFn,
) => {
  const res = {
    requestFn,
    id: actionName,
    [INIT]: createActionBinded(`${actionName} ${INIT}`, identity),
  }

  return [SUCCESS, FAILURE].reduce((reqs, type) => {
    reqs[type] = createRequestStatusAction(actionName, type) // eslint-disable-line
    return reqs
  }, res)
}

export const promisifyAction = (action, payload) => (
  new Promise((resolve, reject) => action(payload, resolve, reject))
)

export function actionsGenerator(actionConfig, path = []) {
  // Create ordinary action if null provided as config
  if (actionConfig === null) {
    return createActionBinded(path.join('.'))
  }

  if (typeof actionConfig === 'function') {
    return createRequestActions(path.join('.'), actionConfig)
  }

  // Recursively call actionsGenerator on all config keys
  if (typeof actionConfig === 'object') {
    return Object.entries(actionConfig).reduce((acc, [key, value]) => {
      acc[key] = actionsGenerator(value, [...path, key])
      return acc
    }, {})
  }

  return actionConfig
}
