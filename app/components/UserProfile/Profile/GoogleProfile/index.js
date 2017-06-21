import React from 'react';
import PropTypes from 'prop-types';

const GoogleProfile = ({ googleData }) => (
  <div>Google data: {googleData}</div>
)

GoogleProfile.propTypes = {
  googleData: PropTypes.object,
}

export default GoogleProfile
