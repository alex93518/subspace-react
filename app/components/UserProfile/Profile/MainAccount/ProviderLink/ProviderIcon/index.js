import React, { PropTypes } from 'react';
import { FaStackOverflow, FaGithub, FaGoogle } from 'react-icons/lib/fa';

const ProviderIcon = ({ providerName }) => {
  if (providerName === 'Stackoverflow') {
    return <FaStackOverflow />
  }
  if (providerName === 'Github') {
    return <FaGithub />
  }
  if (providerName === 'Google') {
    return <FaGoogle />
  }
  return null
}

ProviderIcon.propTypes = {
  providerName: PropTypes.string.isRequired,
}

export default ProviderIcon
