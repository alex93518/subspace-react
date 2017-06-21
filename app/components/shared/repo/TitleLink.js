import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Glyphicon } from 'react-bootstrap';

const Container = styled.span`
  font-size: 16px;
  margin-right: 15px;
`
const Separator = styled.span`
  margin: 0 3px;
`
const AccessIcon = styled(Glyphicon)`
  display: inline-block;
  margin-left: 10px;
  opacity: 0.6;
  font-size: 14px;
`

const TitleLink = ({ userName, repoName, isPrivate }) => (
  <Container>
    <Link to={`/profile/${userName}`}>{userName}</Link>
    <Separator>/</Separator>
    <Link to={`/${userName}/${repoName}`}>{repoName}</Link>
    {
      typeof isPrivate !== 'undefined' &&
      <AccessIcon glyph={isPrivate ? 'flash' : 'lock'} />
    }
  </Container>
)

TitleLink.propTypes = {
  isPrivate: PropTypes.bool,
  userName: PropTypes.string.isRequired,
  repoName: PropTypes.string.isRequired,
}

export default TitleLink
