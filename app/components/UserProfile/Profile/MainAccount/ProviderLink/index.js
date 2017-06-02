import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const MainDiv = styled.div`
  margin-bottom: 10px;
`

const ProviderLink = ({
  isOwner, providerName, providerData, handleClick, tabKey,
}) => {
  if (isOwner || providerData) {
    const linkOwner = (isOwner && !providerData) ?
      (<Button
        onClick={() => handleClick(tabKey)}
        bsSize="xsmall"
        bsStyle="info"
      >
        Add {providerName} Account
      </Button>) : null
    const link = providerData ?
      (<Button onClick={() => handleClick(tabKey)} bsSize="xsmall">
        {providerData.userName}
      </Button>) : linkOwner

    return <MainDiv>{providerName}: {link}</MainDiv>
  }

  return null
}

ProviderLink.propTypes = {
  isOwner: PropTypes.bool.isRequired,
  providerName: PropTypes.string.isRequired,
  providerData: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  tabKey: PropTypes.number.isRequired,
}

export default ProviderLink
