import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { getDiffContent, getDiffChanges } from 'utils/diff';
import { LinkTreeEntry } from 'components/shared/Links';
import DiffChunk from './DiffChunk';

const FileStatusHunk = styled.div`
  width: 100%;
  border-bottom: 1px solid #ddd;
  background-color: #f9f9f9;
  padding: 10px;
`

const SpanAddition = styled.span`
  color: #2cbe4e;
  font-weight: 600;
  margin-right: 15px;
`

const SpanDeletion = styled.span`
  color: #cb2431;
  font-weight: 600;
  margin-right: 10px;
`

const ChunkStatus = styled.div`
  background-color: #f3f8ff;
  padding: 8px 10px;
  color: rgba(27,31,35,0.3);
`

const MainDiv = styled.div`
  border: 1px solid #ddd;
  margin-top: 20px;
  border-radius: 2px;
`

const blockText = chunk => ({
  ...getDiffContent(chunk),
  oldStart: chunk.oldStart,
  newStart: chunk.newStart,
  oldDel: getDiffChanges(chunk, 'del'),
  newAdd: getDiffChanges(chunk, 'add'),
})

const FileDiff = ({
  hunk: { from, to, additions, deletions, chunks },
  variables,
}) => (
  <MainDiv>
    <FileStatusHunk>
      <SpanDeletion>-{deletions}</SpanDeletion>
      <SpanAddition>+{additions}</SpanAddition>
      <LinkTreeEntry vars={{ ...variables, type: 'blob', pathName: to }}>
        {to}
      </LinkTreeEntry>
    </FileStatusHunk>
    <div>
      {
        chunks.map(chunk =>
          <div key={`${from}${to}${chunk.content}`}>
            <ChunkStatus>
              {chunk.content}
            </ChunkStatus>
            <DiffChunk chunk={blockText(chunk)} />
          </div>
        )
      }
    </div>
  </MainDiv>
)

FileDiff.propTypes = {
  hunk: PropTypes.object.isRequired,
  variables: PropTypes.object.isRequired,
}

const DiffHunks = ({ hunks, variables }) => (
  <div>
    {hunks.map(hunk =>
      <FileDiff
        key={`${hunk.from}${hunk.to}`}
        hunk={hunk}
        variables={variables}
      />
    )}
  </div>
)

DiffHunks.propTypes = {
  hunks: PropTypes.array.isRequired,
  variables: PropTypes.object.isRequired,
}

export default DiffHunks
