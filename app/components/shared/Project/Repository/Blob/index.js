import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/styles';
import { compose, mapProps, branch, renderComponent } from 'recompose';
import { createContainer } from 'recompose-relay'
import path from 'path';
import styled from 'styled-components';
import BlobMarkdown from './BlobMarkdown';

const CodeBlock = styled(SyntaxHighlighter)`
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
  createContainer({
    fragments: {
      blob: () => Relay.QL`
        fragment on TreeEntry {
          name
          object {
            ... on Blob {
              text
            }
          }
        }
      `,
    },
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
