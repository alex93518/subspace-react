import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { CardHeader } from 'material-ui/Card';
import MdExpandMore from 'react-icons/lib/md/expand-more';
import MdExpandLess from 'react-icons/lib/md/expand-less';
import { MainCardDiv, IconDiv } from './styles';

const CardHeaderExpander = ({
  handleClickExpander,
  isExpanded,
  ...rest
}) => (
  <MainCardDiv
    role="link"
    onClick={handleClickExpander}
  >
    <CardHeader {...rest} />
    <IconDiv>
      {
        isExpanded ?
          <MdExpandLess width={24} height={24} /> :
          <MdExpandMore width={24} height={24} />
      }
    </IconDiv>
  </MainCardDiv>
)

CardHeaderExpander.propTypes = {
  handleClickExpander: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  // onToggleExpander: PropTypes.func,
}

export default compose(
  withState('isExpanded', 'setIsExpanded', false),
  withHandlers({
    handleClickExpander: props => () => {
      props.setIsExpanded(!props.isExpanded);
      if (props.onToggleExpander) {
        props.onToggleExpander(!props.isExpanded)
      }
    },
  }),
  mapProps(({
    setIsExpanded, onToggleExpander,
    isExpandedVal, keyVal,
    ...rest
  }) => ({ ...rest }))
)(CardHeaderExpander)
