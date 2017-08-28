import React from 'react';
import PropTypes from 'prop-types';
import { compose, branch, renderNothing } from 'recompose';
import ProviderIcon from '../ProviderIcon';
import { ProviderButton, SpanIcon } from './styles';

const AddProviderButton = ({
  providerName, handleClick, tabKey,
}) => (
  <ProviderButton onClick={() => handleClick(tabKey, false)}>
    <SpanIcon>
      <ProviderIcon providerName={providerName} />
    </SpanIcon>
    {providerName}
  </ProviderButton>
)

AddProviderButton.propTypes = {
  providerName: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  tabKey: PropTypes.number.isRequired,
}

export default compose(
  branch(
    props => !props.isOwner,
    renderNothing,
  )
)(AddProviderButton)
