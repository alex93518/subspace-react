import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { getTreeEntryPath } from 'utils/path';
import { LinkBlue, GlyphiconBlue } from 'components/shared/Project/styled'

const iconType = type => type === 'blob' ?
  <GlyphiconBlue glyph="file" /> :
  <GlyphiconBlue glyph="folder-open" />
const byteSize = obj => obj.byteSize ? `${obj.byteSize}b` : ''
const shortName = (name, path) => path ? name.replace(`${path}/`, '') : name

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
  relay: {
    variables: {
      userName,
      projectName,
      branchHead,
      splat,
    },
  },
}) => (
  <tr>
    <td>
      <LinkBlue
        to={
          getTreeEntryPath(userName, projectName, type, branchHead, name)
        }
      >
        <span style={{ paddingRight: 10 }}>{iconType(type)}</span>
        {shortName(name, splat)}
      </LinkBlue>
    </td>
    <td>{byteSize(object)}</td>
    <td>{shortMessage}</td>
    <td>{moment.unix(commitTime).fromNow()}</td>
  </tr>
)

TreeEntry.propTypes = {
  treeEntry: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(TreeEntry, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: '',
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
