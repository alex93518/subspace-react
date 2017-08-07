import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getUserProfilePath } from 'utils/path';
import UserPhoto from 'components/shared/UserPhoto'

export const LinkUserPhoto = ({
  user: { userName, photoUrl },
  ...props
}) => (userName && photoUrl &&
  <Link to={getUserProfilePath(userName)}>
    <UserPhoto userName={userName} photoUrl={photoUrl} {...props} />
  </Link>
)

LinkUserPhoto.propTypes = {
  user: PropTypes.object.isRequired,
}
