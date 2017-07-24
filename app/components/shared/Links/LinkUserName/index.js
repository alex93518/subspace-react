import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getUserProfilePath } from 'utils/path';

const LinkSty = styled(Link)`
  color: #777;
  font-weight: 600;
`

const LinkUserNameBase = ({
  relay, // eslint-disable-line
  user: { userName }, ...props
}) => (
  <LinkSty to={getUserProfilePath(userName)} {...props}>
    {userName}
  </LinkSty>
)

LinkUserNameBase.propTypes = {
  user: PropTypes.object.isRequired,
}

const LinkUserName = createFragmentContainer(LinkUserNameBase, {
  user: graphql`
    fragment LinkUserName_user on User {
      userName
    }
  `,
})

export { LinkUserName }
