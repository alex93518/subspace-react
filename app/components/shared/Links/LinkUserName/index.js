import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Link } from 'react-router';
import { getUserProfilePath } from 'utils/path';

const LinkSty = styled(Link)`
  color: #777;
  font-weight: 600;
`

// eslint-disable-next-line no-unused-vars
const LinkUserNameBase = ({ user: { userName }, relay, ...props }) => (
  <LinkSty to={getUserProfilePath(userName)} {...props}>
    {userName}
  </LinkSty>
)

LinkUserNameBase.propTypes = {
  user: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

const LinkUserName = Relay.createContainer(LinkUserNameBase, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        userName
      }
    `,
  },
})

export { LinkUserName }
