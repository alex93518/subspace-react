import React, { PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';
import Relay from 'react-relay';

const iconType = type => type === 'blob' ?
  <Glyphicon glyph="file" /> :
  <Glyphicon glyph="folder-open" />
const byteSize = obj => obj ? ` - ${obj.byteSize}b` : ''

const TreeEntry = ({
  treeEntry: {
    name,
    type,
    object,
  },
}) => (
  <div>
    {iconType(type)} - {name}{byteSize(object)}
  </div>
)

TreeEntry.propTypes = {
  treeEntry: PropTypes.object.isRequired,
}

export default Relay.createContainer(TreeEntry, {
  fragments: {
    treeEntry: () => Relay.QL`
      fragment on TreeEntry {
        name,
        type,
        object {
          ... on Blob {
            byteSize
          }
        }
      }
    `,
  },
})
