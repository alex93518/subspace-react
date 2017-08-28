import styled from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter';

export const CodeBlock = styled(SyntaxHighlighter)`
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
