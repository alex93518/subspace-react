import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, branch, renderNothing } from 'recompose';
import ProviderInfo from './ProviderInfo';

const MainSpan = styled.span`
  margin-right: 20px;
`

const ProviderLink = ({
  isOwner, providerName, providerData, handleClick, tabKey,
}) => (
  <MainSpan>
    <ProviderInfo
      isOwner={isOwner}
      providerName={providerName}
      providerData={providerData}
      handleClick={handleClick}
      tabKey={tabKey}
    />
  </MainSpan>
)

ProviderLink.propTypes = {
  isOwner: PropTypes.bool.isRequired,
  providerName: PropTypes.string.isRequired,
  providerData: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  tabKey: PropTypes.number.isRequired,
}

export default compose(
  branch(
    props => !props.isOwner && !props.providerData,
    renderNothing
  )
)(ProviderLink)
