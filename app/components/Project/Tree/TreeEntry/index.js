import React, { PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';
import Relay from 'react-relay';

const iconType = type => type === 'blob' ?
  <Glyphicon glyph="file" /> :
  <Glyphicon glyph="folder-open" />
const byteSize = obj => obj.byteSize ? `${obj.byteSize}b` : ''

const TreeEntry = ({
  treeEntry: {
    name,
    type,
    lastCommit: {
      shortMessage,
      commitTime,
    },
    object,
  },
}) => (
  <tr>
    <td><span style={{ paddingRight: 10 }}>{iconType(type)}</span>{name}</td>
    <td>{byteSize(object)}</td>
    <td>{shortMessage}</td>
    <td>{parseInt(
      (((Date.now() / 1000) - commitTime) / (60 * 60)) % 24, 10)} hours ago
    </td>
  </tr>
)

TreeEntry.propTypes = {
  treeEntry: PropTypes.object.isRequired,
}

export default Relay.createContainer(TreeEntry, {
  initialVariables: {
    branchHead: 'refs/heads/master',
  },
  fragments: {
    treeEntry: () => Relay.QL`
      fragment on TreeEntry {
        name
        type
        lastCommit(refName: $branchHead) {
          shortMessage
          commitTime
        }
        object {
          ... on Blob {
            byteSize
          }
        }
      }
    `,
  },
})
