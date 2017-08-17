import styled from 'styled-components'
import { Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { Link } from 'react-router-dom'

export const TopNavbar = styled(Navbar)`
  margin-bottom: 0px;
  background: #333b43;
  padding-top: 3px;
  border-radius: 0px;
  min-height: 54px;
  color: rgba(255,255,255,0.75);
  border: 0px;
`
export const LinkWhite = styled(LinkContainer)`
  & a {
    color: rgba(255,255,255,0.75) !important;
  }
`

export const LinkBrand = styled(Link)`
  color: rgba(255,255,255,1) !important;
  font-size: 22px;
  font-weight: 900;
`
