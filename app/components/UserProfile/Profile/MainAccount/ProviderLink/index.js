import React from 'react';
import PropTypes from 'prop-types';
import { compose, branch, renderNothing } from 'recompose';
import ProviderInfo from './ProviderInfo';
import { MainSpan } from './styles';

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
