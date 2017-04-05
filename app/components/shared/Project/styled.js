import { Link } from 'react-router'
import { Glyphicon, Table, Row } from 'react-bootstrap';
import styled from 'styled-components'

export const GlyphiconBlue = styled(Glyphicon)`
  color: rgba(3,47,98,0.5);
`
export const GlyphiconGrey = styled(Glyphicon)`
  color: grey;
`
export const LinkBlue = styled(Link)`
  color: #0366d6;
`
export const LinkGrey = styled(Link)`
  color: grey;
`

export const TableWhite = styled(Table)`
  background: white;
  border: 1px solid #DDD;
  & > tbody > tr > td {
    padding-left: 10px;
    padding-right: 10px;
  }
`

export const RowSty = styled(Row)`
  padding-top: 15px;
`
