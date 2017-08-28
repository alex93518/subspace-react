import React from 'react';
import PropTypes from 'prop-types';
import { NavItem } from 'react-bootstrap';
import User from './User';
import Notifications from './Notifications';
import Create from './Create';
import { LinkWhite } from '../styles';
import { NavRight } from './styles';

const Protected = ({ user, userName }) => (
  <NavRight pullRight>
    <LinkWhite to="/createproject">
      <NavItem eventKey={4}><Create /></NavItem>
    </LinkWhite>
    <Notifications userName={userName} />
    <User user={user} userName={userName} />
  </NavRight>
)

Protected.propTypes = {
  user: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
}

export default Protected
