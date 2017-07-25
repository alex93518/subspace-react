import React from 'react';
import PropTypes from 'prop-types';
import { getDiffContent, getDiffChanges } from 'utils/diff';
import { LinkTreeEntry } from 'components/shared/Links';
import DiffChunk from './DiffChunk';
import {
  MainDiv, FileStatusHunk,
  SpanAddition, SpanDeletion, ChunkStatus,
} from './styles';

const blockText = chunk => ({
  ...getDiffContent(chunk),
  oldStart: chunk.oldStart,
  newStart: chunk.newStart,
  oldDel: getDiffChanges(chunk, 'del'),
  newAdd: getDiffChanges(chunk, 'add'),
})

const FileDiff = ({
  hunk: { from, to, additions, deletions, chunks },
}) => (
  <MainDiv>
    <FileStatusHunk>
      <SpanDeletion>-{deletions}</SpanDeletion>
      <SpanAddition>+{additions}</SpanAddition>
      <LinkTreeEntry to={to} type={'blob'}>
        {to}
      </LinkTreeEntry>
    </FileStatusHunk>
    <div>
      {
        chunks.map(chunk =>
          (<div key={`${from}${to}${chunk.content}`}>
            <ChunkStatus>
              {chunk.content}
            </ChunkStatus>
            <DiffChunk chunk={blockText(chunk)} />
          </div>)
        )
      }
    </div>
  </MainDiv>
)

FileDiff.propTypes = {
  hunk: PropTypes.object.isRequired,
}

const DiffHunks = ({ hunks }) => (
  <div>
    {hunks.map(hunk =>
      (<FileDiff
        key={`${hunk.from}${hunk.to}`}
        hunk={hunk}
      />)
    )}
  </div>
)

DiffHunks.propTypes = {
  hunks: PropTypes.array.isRequired,
}

export default DiffHunks
