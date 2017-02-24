import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';

const Header = ({ authenticated, displayName, signOut }) =>
  <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="/">Terrella</a>
      </Navbar.Brand>
    </Navbar.Header>
    <Nav>
      <NavItem href="/about">About Us</NavItem>
    </Nav>
    <Nav>
      <NavItem href="/howitworks">How It Works</NavItem>
    </Nav>
    {authenticated ?
      <Nav pullRight>
        {
          displayName ? <NavItem href="/userprofile">{displayName}</NavItem> : null
        }
        <NavItem href="/createproject">Create Project</NavItem>
        <NavItem>
          <Button onClick={signOut} style={{ display: 'inline', padding: 0 }}>Sign out</Button>
        </NavItem>
      </Nav> :
      <Nav pullRight>
        <NavItem href="/login">Sign In</NavItem>
      </Nav>
    }
    <Nav pullRight>
      <NavItem href="/projects">Projects</NavItem>
    </Nav>
  </Navbar>;

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  displayName: PropTypes.string,
  signOut: PropTypes.func.isRequired,
};

export default Header;
