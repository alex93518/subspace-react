import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { makeSelectAuth } from 'redux/selectors'
import { injectSelectors } from 'redux/utils'
import Protected from './Protected'
import { TopNavbar, LinkBrand, LinkWhite } from './styles'

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
    <Nav>
      <LinkWhite to="/projects">
        <NavItem eventKey={6}>Projects</NavItem>
      </LinkWhite>
    </Nav>
    <Nav>
      <LinkWhite to="/documentation">
        <NavItem eventKey={7}>Documentation</NavItem>
      </LinkWhite>
    </Nav>
    {authenticated && <Protected user={user} userName={userName} />}
    {
      !authenticated &&
      <Nav pullRight>
        <LinkWhite to="/login">
          <NavItem eventKey={5}>Sign In</NavItem>
        </LinkWhite>
      </Nav>
    }
  </TopNavbar>
)

Header.propTypes = {
  auth: PropTypes.object.isRequired,
}

export default injectSelectors({
  auth: makeSelectAuth(),
})(Header)
