import React, { PropTypes } from 'react';
import FaGoogle from 'react-icons/lib/fa/google';
import FaGithub from 'react-icons/lib/fa/github';
import FaStackOverflow from 'react-icons/lib/fa/stack-overflow';

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
