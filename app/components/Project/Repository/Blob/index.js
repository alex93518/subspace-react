import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components'
import { Col } from 'react-bootstrap';
import RichTextEditor from 'react-rte';

const FilesCol = styled(Col)`
  padding-top: 15px;
`

const Blob = ({
  blob: {
    entries,
  },
}) => (
  <FilesCol md={12}>
    <RichTextEditor
      readOnly
      value={RichTextEditor.createValueFromString(
        entries[0].object.text.replace('\n', '<br />'),
        'html')
      }
      onChange={() => {}}
    />
  </FilesCol>
)

Blob.propTypes = {
  blob: PropTypes.object.isRequired,
}

export default Relay.createContainer(Blob, {
  initialVariables: {
    path: '',
  },
  fragments: {
    blob: () => Relay.QL`
      fragment on Tree {
        entries(path: $path) {
          object {
            ... on Blob {
              text
            }
          }
        }
      }
    `,
  },
})
