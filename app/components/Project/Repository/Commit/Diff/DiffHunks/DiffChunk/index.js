import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import DiffCodeBlock from './DiffCodeBlock'

const DiffChunk = ({ chunk }) => (
  <Row>
    <Col md={6}>
      <DiffCodeBlock
        bgColor="#ffecec"
        content={chunk.oldContent}
        start={chunk.oldStart}
        addDel={chunk.oldDel}
        nullSeq={chunk.oldNullSeq}
      />
    </Col>
    <Col md={6}>
      <DiffCodeBlock
        bgColor="#eaffea"
        content={chunk.newContent}
        start={chunk.newStart}
        addDel={chunk.newAdd}
        nullSeq={chunk.newNullSeq}
      />
    </Col>
  </Row>
)

DiffChunk.propTypes = {
  chunk: PropTypes.object.isRequired,
}

export default DiffChunk
