import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { getUserProfilePath } from 'utils/path';

const LinkUserPhotoBase = ({
  user: { userName, photoUrl },
  relay,
  ...props
}) => (
  <Link to={getUserProfilePath(userName)}>
    <img
      alt={`@${userName}`}
      src={photoUrl}
      {...props}
    />
  </Link>
)

LinkUserPhotoBase.propTypes = {
  user: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

const LinkUserPhoto = Relay.createContainer(LinkUserPhotoBase, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        userName
        photoUrl
      }
    `,
  },
})

export { LinkUserPhoto }
