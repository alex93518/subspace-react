import { browserHistory } from 'react-router';

export const redirect = (...args) => browserHistory.push(...args)
