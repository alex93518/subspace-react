import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { Link } from 'react-router-dom';
import { getUserProfilePath } from 'utils/path';

const LinkUserPhotoBase = ({
  user: { userName, photoUrl },
  relay, // eslint-disable-line no-unused-vars
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
