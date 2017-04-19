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

const styleHeight = (nullIdx, lineNumber) => {
  const defaultHeight = 20;
  const chunkSeqIdx = nullIdx.idx.indexOf(lineNumber)
  if (chunkSeqIdx !== -1) {
    return defaultHeight + (nullIdx.seq[chunkSeqIdx] * defaultHeight);
  }

  return defaultHeight;
}

const DiffCodeBlock = ({ content, start, addDel, bgColor, nullIdx }) =>
  <CodeBlock
    style={xcode}
    showLineNumbers
    wrapLines
    startingLineNumber={start}
    customStyle={({
      border: 0,
      margin: 0,
      padding: 0,
      borderRadius: 0,
    })}
    lineStyle={lineNumber => {
      const style = {
        display: 'block',
        width: '100%',
        height: styleHeight(nullIdx, lineNumber),
      };
      if (addDel.includes(lineNumber)) {
        style.backgroundColor = bgColor;
      }
      return style;
    }}
    lineNumberStyle={oriLineNumber => {
      const lineNumber = (oriLineNumber - start) + 1
      const style = {
        display: 'block',
        height: styleHeight(nullIdx, lineNumber),
      };
      return style;
    }}
  >
    {content || ''}
  </CodeBlock>

DiffCodeBlock.propTypes = {
  content: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  addDel: PropTypes.array.isRequired,
  bgColor: PropTypes.string.isRequired,
  nullIdx: PropTypes.object.isRequired,
}

const DiffChunk = ({ chunk }) => (
  <Row>
    <Col md={6}>
      <DiffCodeBlock
        content={chunk.oldContent}
        start={chunk.oldStart}
        addDel={chunk.oldDel}
        bgColor={'#ffecec'}
        nullIdx={chunk.oldNullIdx}
      />
    </Col>
    <Col md={6}>
      <DiffCodeBlock
        content={chunk.newContent}
        start={chunk.newStart}
        addDel={chunk.newAdd}
        bgColor={'#eaffea'}
        nullIdx={chunk.newNullIdx}
      />
    </Col>
  </Row>
)

DiffChunk.propTypes = {
  chunk: PropTypes.object.isRequired,
}

export default DiffChunk
