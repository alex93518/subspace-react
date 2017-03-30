import React, { PropTypes } from 'react';
import { Glyphicon } from 'react-bootstrap';
import Relay from 'react-relay';
import moment from 'moment';

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
  path,
  onRowClick,
}) => (
  <tr // eslint-disable-line jsx-a11y/no-static-element-interactions
    onClick={() => onRowClick(name)}
    style={{ cursor: 'pointer' }}
  >
    <td>
      <span style={{ paddingRight: 10 }}>{iconType(type)}</span>
      {path ? name.replace(`${path}/`, '') : name}
    </td>
    <td>{byteSize(object)}</td>
    <td>{shortMessage}</td>
    <td>{moment.unix(commitTime).fromNow()}</td>
  </tr>
)

TreeEntry.propTypes = {
  treeEntry: PropTypes.object.isRequired,
  path: PropTypes.string,
  onRowClick: PropTypes.func,
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
