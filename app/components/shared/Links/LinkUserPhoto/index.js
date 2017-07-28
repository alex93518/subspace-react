import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FaUser from 'react-icons/lib/fa/user';
import { getUserProfilePath } from 'utils/path';

const UserIcon = styled(FaUser)`
  font-size: 140px;
  color: rgba(3, 102, 214, 0.54);
`;

export const LinkUserPhoto = ({
  user: { userName, photoUrl },
  ...props
}) => (userName && photoUrl &&
  <Link to={getUserProfilePath(userName)}>
    {
      photoUrl ?
        <Image
          alt={`@${userName}`}
          src={photoUrl}
          {...props}
          circle
        /> :
        <UserIcon {...props} />
    }
  </Link>
)

LinkUserPhoto.propTypes = {
  user: PropTypes.object.isRequired,
}
