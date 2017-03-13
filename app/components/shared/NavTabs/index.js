import React, { PropTypes } from 'react'
import { redirect } from 'redux/utils'
import { Nav, NavItem } from 'react-bootstrap';

const NavTabs = ({ config }) => (
  <Nav
    bsStyle="tabs"
    onSelect={redirect}
    activeKey={config[0].link}
  >
    {config.map(({ link, label }) => (
      <NavItem key={link} eventKey={link}>
        {label}
      </NavItem>
    ))}
  </Nav>
)

NavTabs.propTypes = {
  config: PropTypes.array.isRequired,
}

export default NavTabs
