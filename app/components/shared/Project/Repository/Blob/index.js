import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import RichTextEditor from 'react-rte';
import { getFileType, convertText } from 'utils/editor/rte';

const Blob = ({
  blob: {
    entries: [firstEntry],
  },
}) => (
  <RichTextEditor
    readOnly
    value={RichTextEditor.createValueFromString(
      convertText(firstEntry.name, firstEntry.object.text),
      getFileType(firstEntry.name)
    )}
  />
)

Blob.propTypes = {
  blob: PropTypes.object.isRequired,
}

export default Relay.createContainer(Blob, {
  initialVariables: {
    splat: '',
  },
  fragments: {
    blob: () => Relay.QL`
      fragment on Tree {
        entries(path: $splat) {
          name
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
