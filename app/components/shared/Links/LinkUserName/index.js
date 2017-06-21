import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
