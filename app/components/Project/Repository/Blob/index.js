import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import RichTextEditor from 'react-rte';

const Blob = ({
  blob: {
    entries,
  },
}) => (
  <RichTextEditor
    readOnly
    value={RichTextEditor.createValueFromString(
      entries[0].name.endsWith('.md') ? entries[0].object.text :
      entries[0].object.text.replace(/\n/g, '<br />'),
      entries[0].name.endsWith('.md') ? 'markdown' : 'html')
    }
    onChange={() => {}}
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
