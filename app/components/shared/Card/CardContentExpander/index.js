import React from 'react';
import PropTypes from 'prop-types';
import { CardContent } from 'material-ui/Card';

const CardContentExpander = ({
  isExpandedVal,
  onToggleExpander,
  ...rest
}) => (
  isExpandedVal && <CardContent {...rest} />
)

CardContentExpander.propTypes = {
  isExpandedVal: PropTypes.bool,
  onToggleExpander: PropTypes.func,
  children: PropTypes.node,
}

export default CardContentExpander
