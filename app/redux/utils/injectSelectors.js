import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect';

export const injectSelectors = selectorConfig =>
  connect(createStructuredSelector(selectorConfig))
