import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import Card from 'material-ui/Card';

const CardExpander = ({
  children,
  isExpanded,
  setIsExpanded,
  ...rest
}) => (
  <Card {...rest}>
    {React.Children.map(children, child => React.cloneElement(child, {
      onToggleExpander: setIsExpanded,
      isExpandedVal: isExpanded,
    }))}
  </Card>
)

CardExpander.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  setIsExpanded: PropTypes.func.isRequired,
  children: PropTypes.node,
}

export default compose(
  withState('isExpanded', 'setIsExpanded', false),
)(CardExpander)

export { default as CardHeader } from './CardHeaderExpander';
export { default as CardContent } from './CardContentExpander';
