import React, { PropTypes } from 'react';

const GoogleProfile = ({ googleData }) => (
  <div>Google data: {googleData}</div>
)

GoogleProfile.propTypes = {
  googleData: PropTypes.object,
}

export default GoogleProfile
