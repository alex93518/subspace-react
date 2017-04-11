import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import styled from 'styled-components';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import { authActions } from 'redux/auth/actions'

const TopNavbar = styled(Navbar)`
  margin-bottom: 0px;
`

const Header = ({ authenticated, displayName, userName }) => (
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
    {authenticated ?
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
          <Button
            onClick={authActions.signOut.init}
            style={{ display: 'inline', padding: '0 6px' }}
          >
            Sign out
          </Button>
        </NavItem>
      </Nav> :
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
  authenticated: PropTypes.bool.isRequired,
  displayName: PropTypes.string,
  userName: PropTypes.string,
}

export default Header
