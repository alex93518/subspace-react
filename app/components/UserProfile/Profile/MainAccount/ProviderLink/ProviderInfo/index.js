import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { compose, branch, renderComponent } from 'recompose';
import styled from 'styled-components';
import AddProviderButton from '../AddProviderButton';
import ProviderIcon from '../ProviderIcon';

const ButtonProviderInfo = styled(Button)`
  background: none !important;
  border: 0px !important;
  padding: 0px !important;
  margin-right: 10px !important;
`

const UserNameDiv = styled.div`
  color: #0C0D0E;
  font-size: 17px;
  font-weight: 700;
`

const ProviderNameDiv = styled.div`
  color: #808080;
  font-size: 14px;
`

const SpanIcon = styled.span`
  vertical-align: text-bottom;
  margin-right: 8px;
  font-size: 18px;
`

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
