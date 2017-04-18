import React, { PropTypes } from 'react';
import styled from 'styled-components';
import R from 'ramda';
import DiffChunk from './DiffChunk';

const FileStatusHunk = styled.div`
  width: 100%;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  padding: 10px;
  margin-top: 15px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
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
  padding: 4px 10px;
  color: rgba(27,31,35,0.3);
`

const blockText = chunk => {
  const text = type => R.pipe(
    R.filter(_ => _.type === 'normal' || _.type === type),
    R.map(R.prop('content'))
  )(chunk.changes)

  const changes = type => R.pipe(
    R.filter(_ => _.type === type),
    R.map(R.prop('ln')),
    R.map(R.add(type === 'del' ? -(chunk.oldStart - 1) : -(chunk.newStart - 1)))
  )(chunk.changes)

  const line = type => {
    let lineDiff = chunk.oldStart - chunk.newStart
    const retChanges = []
    if (type === 'ln1') {
      chunk.changes.forEach(change => {
        if (!change.ln) {
          retChanges.push(change.ln1 - change.ln2 - lineDiff)
        } else if (change.type === 'del') {
          retChanges.push(0)
          lineDiff += 1
        }
      })
    } else if (type === 'ln2') {
      chunk.changes.forEach(change => {
        if (!change.ln) {
          retChanges.push(change.ln2 - change.ln1)
        } else if (change.type === 'add') {
          retChanges.push(0)
        }
      })
    }

    return retChanges
  }

  const oldText = text('del')
  const newText = text('add')
  const oldDel = changes('del')
  const newAdd = changes('add')
  const oldLn = line('ln1')
  const newLn = line('ln2')

  console.log(oldLn)
  console.log(newLn)

  return {
    oldText: oldText.join('\r\n'),
    newText: newText.join('\r\n'),
    oldStart: chunk.oldStart,
    newStart: chunk.newStart,
    oldDel,
    newAdd,
    oldLn,
    newLn,
  }
}

const DiffHunks = ({ hunks }) => (
  <div>
    {hunks.map(hunk =>
      <FileDiff
        key={`${hunk.from}${hunk.to}`}
        hunk={hunk}
      />
    )}
  </div>
)

DiffHunks.propTypes = {
  hunks: PropTypes.array.isRequired,
}

const FileDiff = ({
  hunk: { from, to, additions, deletions, chunks },
}) => (
  <div>
    <FileStatusHunk>
      <SpanDeletion>-{deletions}</SpanDeletion>
      <SpanAddition>+{additions}</SpanAddition>
      {to}
    </FileStatusHunk>
    <div>
      {
        chunks.map(chunk =>
          <div key={`${from}${to}${chunk.content}`}>
            {console.log(chunk)}
            <ChunkStatus>
              {chunk.content}
            </ChunkStatus>
            <DiffChunk chunk={blockText(chunk)} />
          </div>
        )
      }
    </div>
  </div>
)

FileDiff.propTypes = {
  hunk: PropTypes.object.isRequired,
}

export default DiffHunks
