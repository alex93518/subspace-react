import React, { PropTypes } from 'react';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import DiffChunk from './DiffChunk';

const DiffHunks = ({ hunks, oldText, newText }) => (
  <div>
    {hunks.map(hunk =>
      <FileDiff
        key={`${hunk.from}${hunk.to}`}
        hunk={hunk}
        oldText={oldText}
        newText={newText}
      />
    )}
  </div>
)

DiffHunks.propTypes = {
  hunks: PropTypes.array.isRequired,
  oldText: PropTypes.string,
  newText: PropTypes.string,
}

const MainHunk = styled(Table)`
  border: 1px solid #ddd;
  margin-top: 15px;
`

const TdChunk = styled.td`
  width: 50%;
`

const FileDiff = ({ oldText, newText,
  hunk: { from, to, additions, deletions, chunks },
}) => (
  <MainHunk>
    <tbody>
      <tr>
        <td colSpan={2}>
          {additions} additions, {deletions} deletions -
          {' '}
          {to}
        </td>
      </tr>
      {
        chunks.map(chunk =>
          <tr key={`${from}${to}${chunk.content}`}>
            <TdChunk>
              <DiffChunk
                chunk={chunk}
                text={oldText}
                isOld
              />
            </TdChunk>
            <TdChunk>
              <DiffChunk
                chunk={chunk}
                text={newText}
                isOld={false}
              />
            </TdChunk>
          </tr>
        )
      }
    </tbody>
  </MainHunk>
)

FileDiff.propTypes = {
  hunk: PropTypes.object.isRequired,
  oldText: PropTypes.string,
  newText: PropTypes.string,
}

export default DiffHunks
