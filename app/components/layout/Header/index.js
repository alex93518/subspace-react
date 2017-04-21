import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import { makeSelectAuth } from 'redux/selectors';
import { injectSelectors } from 'redux/utils'
import { authActions } from 'redux/auth/actions'

const TopNavbar = styled(Navbar)`
  margin-bottom: 0px;
`
const SignoutButton = styled(Button)`
  display: inline;
  padding: 0 6px;
`

const ProtectedNav = ({ user: { displayName, userName } }) => (
  <Nav pullRight>
    {
      userName &&
      <LinkContainer to={`/profile/${userName}`}>
        <NavItem eventKey={3}>{displayName}<i> @{userName}</i></NavItem>
      </LinkContainer>
    }
    <LinkContainer to="/createproject">
      <NavItem eventKey={4}>Create Project</NavItem>
    </LinkContainer>
    <NavItem>
      <SignoutButton onClick={authActions.signOut.init}>
        Sign out
      </SignoutButton>
    </NavItem>
  </Nav>
)

ProtectedNav.propTypes = {
  user: PropTypes.object.isRequired,
}

const Header = ({ auth: { authenticated, user } }) => (
  <TopNavbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">Terrella</Link>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <LinkContainer to="/about">
        <NavItem eventKey={1}>About Us</NavItem>
      </LinkContainer>
    </Nav>
    <Nav>
      <LinkContainer to="/howitworks">
        <NavItem eventKey={2}>How It Works</NavItem>
      </LinkContainer>
    </Nav>
    {authenticated && <ProtectedNav user={user} />}
    {
      !authenticated &&
      <Nav pullRight>
        <LinkContainer to="/login">
          <NavItem eventKey={5}>Sign In</NavItem>
        </LinkContainer>
      </Nav>
    }
    <Nav pullRight>
      <LinkContainer to="/projects">
        <NavItem eventKey={6}>Projects</NavItem>
      </LinkContainer>
    </Nav>
  </TopNavbar>
)

Header.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default injectSelectors({
  auth: makeSelectAuth(),
})(Header)
