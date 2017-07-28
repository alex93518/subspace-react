import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getUserProfilePath } from 'utils/path';

const LinkSty = styled(Link)`
  color: #777;
  font-weight: 600;
`

export const LinkUserName = ({
  userName, ...props
}) => (
  <LinkSty to={getUserProfilePath(userName)} {...props}>
    {userName}
  </LinkSty>
)

LinkUserName.propTypes = {
  userName: PropTypes.string.isRequired,
}
