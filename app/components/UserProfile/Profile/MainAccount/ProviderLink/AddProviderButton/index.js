import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, branch, renderNothing } from 'recompose';
import { ButtonGit } from 'components/shared/ButtonGit';
import ProviderIcon from '../ProviderIcon';

const ProviderButton = styled(ButtonGit)`
  padding: 10px;
`

const SpanIcon = styled.span`
  vertical-align: text-bottom;
  margin-right: 8px;
  font-size: 24px;
`

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
