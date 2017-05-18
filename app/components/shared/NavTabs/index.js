import React, { PropTypes } from 'react'
import styled from 'styled-components'
import { Nav, NavItem } from 'react-bootstrap';
import { withRouter } from 'react-router-dom'

const MainNavTabs = styled(Nav)`
  border: none;
`

const NavTabs = ({
  configActive: { config, activeKey },
  history: { push },
}) => (
  <MainNavTabs
    bsStyle="tabs"
    onSelect={url => push(url)}
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

export default withRouter(NavTabs)
