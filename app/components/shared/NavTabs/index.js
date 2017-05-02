import React, { PropTypes } from 'react'
import { redirect } from 'redux/utils'
import styled from 'styled-components'
import { Nav, NavItem } from 'react-bootstrap';

const MainNavTabs = styled(Nav)`
  border: none;
`

const NavTabs = ({ configActive: { config, activeKey } }) => (
  <MainNavTabs
    bsStyle="tabs"
    onSelect={redirect}
    activeKey={activeKey || config[0].link}
  >
    {config.map(({ link, label }) => (
      <NavItem key={link} eventKey={link}>
        {label}
      </NavItem>
    ))}
  </MainNavTabs>
)

NavTabs.propTypes = {
  configActive: PropTypes.object.isRequired,
}

export default NavTabs
