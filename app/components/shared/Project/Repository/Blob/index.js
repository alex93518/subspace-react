import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import SyntaxHighlighter from 'react-syntax-highlighter';
import xcode from 'react-syntax-highlighter/dist/styles/xcode';
import { compose, mapProps, branch, renderComponent } from 'recompose';
import path from 'path';
import styled from 'styled-components';
import BlobMarkdown from './BlobMarkdown';

const CodeBlock = styled(SyntaxHighlighter)`
  font-size: 13px;
  & .react-syntax-highlighter-line-number {
    display: block;
    width: 100%;
    color: #ccc;
    padding-right: 15px;
    padding-left: 10px;
    text-align: right;
  }
`

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
    blob: graphql`
      fragment Blob_blob on TreeEntry {
        name
        object {
          ... on Blob {
            text
          }
        }
      }
    `,
  }),
  mapProps(({ blob }) => ({
    text: blob.object.text,
    name: blob.name,
  })),
  branch(
    props => path.extname(props.name).toLowerCase() === '.md',
    renderComponent(BlobMarkdown)
  ),
)(Blob)
