import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import styled from 'styled-components'
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap'
import { makeSelectAuth } from 'redux/selectors'
import { injectSelectors } from 'redux/utils'
import { authSignout } from 'relay/RelayEnvironment'

const TopNavbar = styled(Navbar)`
  margin-bottom: 0px;
  background: #333b43;
  min-height: 50px;
  padding-top: 3px;
  border-radius: 0px;
  color: rgba(255,255,255,0.75);
`
const SignoutButton = styled(Button)`
  display: inline;
  padding: 0 6px;
`

const LinkWhite = styled(LinkContainer)`
  & a {
    color: rgba(255,255,255,0.75) !important;
  }
`

const LinkBrand = styled(Link)`
  color: rgba(255,255,255,1) !important;
  font-size: 22px;
  font-weight: 900;
`

const ProtectedNav = ({ user: { displayName }, userName }) => (
  <Nav pullRight>
    <LinkWhite to="/createproject">
      <NavItem eventKey={4}>Create Project</NavItem>
    </LinkWhite>
    {
      userName &&
      <LinkWhite to={`/profile/${userName}`}>
        <NavItem eventKey={3}>{displayName}<i> @{userName}</i></NavItem>
      </LinkWhite>
    }
    <NavItem>
      <SignoutButton onClick={authSignout.signOut.init}>
        Sign out
      </SignoutButton>
    </NavItem>
  </Nav>
)

ProtectedNav.propTypes = {
  user: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
}

const Header = ({ auth: { authenticated, user, userName } }) => (
  <TopNavbar>
    <Navbar.Header>
      <Navbar.Brand>
        <LinkBrand to="/">Subspace</LinkBrand>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <LinkWhite to="/about">
        <NavItem eventKey={1}>About Us</NavItem>
      </LinkWhite>
    </Nav>
    <Nav>
      <LinkWhite to="/howitworks">
        <NavItem eventKey={2}>How It Works</NavItem>
      </LinkWhite>
    </Nav>
    {authenticated && <ProtectedNav user={user} userName={userName} />}
    {
      !authenticated &&
      <Nav pullRight>
        <LinkWhite to="/login">
          <NavItem eventKey={5}>Sign In</NavItem>
        </LinkWhite>
      </Nav>
    }
    <Nav pullRight>
      <LinkWhite to="/projects">
        <NavItem eventKey={6}>Projects</NavItem>
      </LinkWhite>
    </Nav>
  </TopNavbar>
)

Header.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default injectSelectors({
  auth: makeSelectAuth(),
})(Header)
