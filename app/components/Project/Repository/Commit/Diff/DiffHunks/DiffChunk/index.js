import React, { PropTypes } from 'react';
import styled from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/styles';
import { Row, Col } from 'react-bootstrap';

const CodeBlock = styled(SyntaxHighlighter)`
  & .react-syntax-highlighter-line-number {
    display: block;
    height: 20px;
    width: 100%;
    color: #ccc;
    padding-right: 15px;
    padding-left: 10px;
    text-align: right;
  }
`

const DiffChunk = ({ chunk }) => (
  <Row>
    <Col md={6}>
      {console.log(chunk)}
      <CodeBlock
        style={xcode}
        showLineNumbers
        wrapLines
        startingLineNumber={chunk.oldStart}
        lineStyle={lineNumber => {
          const style = {
            display: 'block',
            height: 20,
          };
          console.log(lineNumber)
          if (chunk.oldDel.includes(lineNumber)) {
            style.backgroundColor = '#ffecec';
          }
          return style;
        }}
      >
        {chunk.oldText || ''}
      </CodeBlock>
    </Col>
    <Col md={6}>
      <CodeBlock
        style={xcode}
        showLineNumbers
        wrapLines
        startingLineNumber={chunk.newStart}
        lineStyle={lineNumber => {
          const style = {
            display: 'block',
            height: 20,
          };
          if (chunk.newAdd.includes(lineNumber)) {
            style.backgroundColor = '#eaffea';
          }
          return style;
        }}
      >
        {chunk.newText || ''}
      </CodeBlock>
    </Col>
  </Row>
)

DiffChunk.propTypes = {
  chunk: PropTypes.object.isRequired,
}

export default DiffChunk
