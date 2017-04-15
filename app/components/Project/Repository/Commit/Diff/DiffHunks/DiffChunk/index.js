import React, { PropTypes } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { xcode } from 'react-syntax-highlighter/dist/styles';

const DiffChunk = ({ text, isOld, chunk }) => (
  <div>
    {console.log(isOld)}
    {console.log(chunk)}
    <SyntaxHighlighter style={xcode}>
      {text || ''}
    </SyntaxHighlighter>
  </div>
)

DiffChunk.propTypes = {
  chunk: PropTypes.object.isRequired,
  text: PropTypes.string,
  isOld: PropTypes.bool.isRequired,
}

export default DiffChunk
