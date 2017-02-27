import { createActionBinded } from 'redux/utils/dispatch'

export const promisifyAction = (action, payload) => (
  new Promise((resolve, reject) => action(payload, resolve, reject))
)

export function actionsGenerator(actionConfig, path = []) {
  // Create ordinary action if null provided as config
  if (actionConfig === null) {
    return createActionBinded(path.join('.'))
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

