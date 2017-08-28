import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps, branch, renderComponent } from 'recompose';
import { Table, Alert } from 'react-bootstrap';
import Blob from 'components/shared/Project/Repository/Blob';
import { TdHead, ReadmeIcon, TdBlob } from './styles'

const NoReadme = () => (
  <Alert bsStyle="info">
    Help people interested in this repository
    {' '}
    understand your project by adding a README.
  </Alert>
)

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
          <Blob treeEntry={entry} />
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
    tree: graphql`
      fragment Readme_tree on Tree {
        treeReadme: entries(path: "README.md") {
          oid
          ...Blob_treeEntry
        }
      }
    `,
  }),
  branch(
    props => !props.tree.treeReadme.length,
    renderComponent(NoReadme)
  ),
  mapProps(({
    tree: { treeReadme },
  }) => ({
    entry: treeReadme[0],
  })),
)(Readme)
