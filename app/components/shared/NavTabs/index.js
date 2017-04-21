import React, { PropTypes } from 'react'
import { redirect } from 'redux/utils'
import styled from 'styled-components'
import { Nav, NavItem } from 'react-bootstrap';

const MainNavTabs = styled(Nav)`
  border: none;
`

const NavTabs = ({ config }) => (
  <MainNavTabs
    bsStyle="tabs"
    onSelect={redirect}
    activeKey={config[0].link}
  >
    {config.map(({ link, label }) => (
      <NavItem key={link} eventKey={link}>
        {label}
      </NavItem>
    ))}
  </MainNavTabs>
)

NavTabs.propTypes = {
  config: PropTypes.array.isRequired,
}

export default NavTabs
