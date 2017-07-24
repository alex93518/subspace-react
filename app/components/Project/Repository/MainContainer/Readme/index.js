import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps, branch, renderComponent } from 'recompose';
import { Table, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import GoBook from 'react-icons/lib/go/book';
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
  withRelayFragment({
    readme: graphql`
      fragment Readme_readme on Tree {
        treeReadme: entries(path: "README.md") {
          oid
          ...Blob_blob
        }
      }
    `,
  }),
  branch(
    props => !props.readme.treeReadme.length,
    renderComponent(NoReadme)
  ),
  mapProps(({
    readme: { treeReadme },
  }) => ({
    entry: treeReadme.entries[0],
  })),
)(Readme)
