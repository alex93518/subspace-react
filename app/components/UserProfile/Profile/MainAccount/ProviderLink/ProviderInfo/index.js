import React from 'react';
import PropTypes from 'prop-types';
import { compose, branch, renderComponent } from 'recompose';
import AddProviderButton from '../AddProviderButton';
import ProviderIcon from '../ProviderIcon';
import {
  ButtonProviderInfo, ProviderNameDiv, SpanIcon, UserNameDiv,
} from './styles'

const ProviderInfo = ({
  providerData, providerName, handleClick, tabKey,
}) => (
  <ButtonProviderInfo onClick={() => handleClick(tabKey)} bsSize="xsmall">
    <ProviderNameDiv>
      <SpanIcon>
        <ProviderIcon providerName={providerName} />
      </SpanIcon>
      {providerName}
    </ProviderNameDiv>
    <UserNameDiv>
      {providerData.userName}
    </UserNameDiv>
  </ButtonProviderInfo>
)

ProviderInfo.propTypes = {
  providerData: PropTypes.object,
  providerName: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  tabKey: PropTypes.number.isRequired,
}

export default compose(
  branch(
    props => !props.providerData,
    renderComponent(AddProviderButton)
  )
)(ProviderInfo)
