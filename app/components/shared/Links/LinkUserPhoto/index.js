import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FaUser from 'react-icons/lib/fa/user';
import { getUserProfilePath } from 'utils/path';

const UserIcon = styled(FaUser)`
  font-size: 140px;
  color: rgba(3, 102, 214, 0.54);
`;

const LinkUserPhotoBase = ({
  relay, // eslint-disable-line
  user: { userName, photoUrl },
  ...props
}) => (
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

LinkUserPhotoBase.propTypes = {
  user: PropTypes.object.isRequired,
}

const LinkUserPhoto = createFragmentContainer(LinkUserPhotoBase, {
  user: graphql`
    fragment LinkUserPhoto_user on User {
      userName
      photoUrl
    }
  `,
})

export { LinkUserPhoto }
