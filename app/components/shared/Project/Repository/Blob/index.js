import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import xcode from 'react-syntax-highlighter/dist/styles/xcode';
import { compose, mapProps, branch, renderComponent } from 'recompose';
import path from 'path';
import BlobMarkdown from './BlobMarkdown';
import { CodeBlock } from './styles';

const Blob = ({ text }) => (
  <CodeBlock style={xcode} showLineNumbers>
    {text}
  </CodeBlock>
)

Blob.propTypes = {
  text: PropTypes.string.isRequired,
}

export default compose(
  withRelayFragment({
    treeEntry: graphql`
      fragment Blob_treeEntry on TreeEntry {
        name
        object {
          ... on Blob {
            text
          }
        }
      }
    `,
  }),
  mapProps(({ treeEntry }) => ({
    text: treeEntry.object.text,
    name: treeEntry.name,
  })),
  branch(
    props => path.extname(props.name).toLowerCase() === '.md',
    renderComponent(BlobMarkdown)
  ),
)(Blob)
