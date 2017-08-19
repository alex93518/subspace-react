import React from 'react';
import PropTypes from 'prop-types';
import { Link as LinkBase } from 'react-router-dom'
import styled from 'styled-components'
import { Glyphicon } from 'react-bootstrap';

const Container = styled.span`
  font-size: ${props => typeof props['data-isHead'] === 'undefined' ? '16' : '22'}px;
  margin-right: 15px;
  ${props => typeof props['data-isWhite'] !== 'undefined' ? 'color: #fff;' : ''}
`
const Separator = styled.span`
  margin: 0 3px;
`
const AccessIcon = styled(Glyphicon)`
  display: inline-block;
  margin-left: 10px;
  opacity: 0.9;
  font-size: 14px;
`

const Link = styled(LinkBase)`
  ${props => typeof props['data-isWhite'] !== 'undefined' ? 'color: #fff;' : ''}
  &:hover {
    ${props => typeof props['data-isWhite'] !== 'undefined' ? 'color: #FFE0B2;' : ''}
  }
`

// eslint-disable-next-line
const TitleLink = ({ userName, repoName, isPrivate, isWhite, isHead }) => (
  <Container data-isWhite={isWhite} data-isHead={isHead}>
    <Link to={`/profile/${userName}`} data-isWhite={isWhite} data-isHead={isHead}>{userName}</Link>
    <Separator>/</Separator>
    <Link to={`/${userName}/${repoName}`} data-isWhite={isWhite} data-isHead={isHead}>{repoName}</Link>
    {
      typeof isPrivate !== 'undefined' &&
      <AccessIcon glyph={isPrivate ? 'flash' : 'lock'} />
    }
  </Container>
)

TitleLink.propTypes = {
  isPrivate: PropTypes.bool,
  isWhite: PropTypes.bool,
  userName: PropTypes.string.isRequired,
  repoName: PropTypes.string.isRequired,
}

export default TitleLink
