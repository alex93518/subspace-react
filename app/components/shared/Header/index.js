import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

const Header = ({ authenticated, displayName, signOut }) =>
  <Navbar>
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
          displayName ? <NavItem href="/userprofile">{displayName}</NavItem> : null
        }
        <LinkContainer to="/createproject">
          <NavItem eventKey={3}>Create Project</NavItem>
        </LinkContainer>
        <NavItem>
          <Button onClick={signOut} style={{ display: 'inline', padding: 0 }}>Sign out</Button>
        </NavItem>
      </Nav> :
      <Nav pullRight>
        <LinkContainer to="/login">
          <NavItem eventKey={4}>Sign In</NavItem>
        </LinkContainer>
      </Nav>
    }
    <Nav pullRight>
      <LinkContainer to="/projects">
        <NavItem eventKey={5}>Projects</NavItem>
      </LinkContainer>
    </Nav>
  </Navbar>;

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  displayName: PropTypes.string,
  signOut: PropTypes.func.isRequired,
};

export default Header;
