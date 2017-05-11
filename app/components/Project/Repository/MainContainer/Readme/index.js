import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay'
import { compose, mapProps, branch, renderComponent } from 'recompose';
import { Table, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { GoBook } from 'react-icons/lib/go'
import Blob from 'components/shared/Project/Repository/Blob';

const NoReadme = () => (
  <Alert bsStyle="info">
    Help people interested in this repository
    {' '}
    understand your project by adding a README.
  </Alert>
)

const ReadmeIcon = styled(GoBook)`
  font-size: 20px;
  margin-right: 5px;
`

const TdHead = styled.td`
  border-right: 1px solid #ddd;
  border-left: 1px solid #ddd;
  background-color: #f6f8fa;
  padding: 9px 10px 10px !important;
  font-size: 14px;
  line-height: 17px !important;
  color: #24292e;
`

const TdBlob = styled.td`
  padding: 0px !important;
  border-top: 0px !important;
`

const Readme = ({ entry }) => (
  <Table>
    <tbody>
      <tr>
        <TdHead>
          <ReadmeIcon /> README.md
        </TdHead>
      </tr>
      <tr>
        <TdBlob>
          <Blob blob={entry} />
        </TdBlob>
      </tr>
    </tbody>
  </Table>
)

Readme.propTypes = {
  entry: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    fragments: {
      readme: () => Relay.QL`
        fragment on Tree {
          entries(path: "README.md") {
            oid
            ${Blob.getFragment('blob')}
          }
        }
      `,
    },
  }),
  branch(
    props => !props.readme.entries.length,
    renderComponent(NoReadme)
  ),
  mapProps(({ readme: { entries } }) => ({ entry: entries[0] })),
)(Readme)
