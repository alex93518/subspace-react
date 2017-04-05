import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import { getTreeEntryPath, getCommitPath } from 'utils/path';
import { Link } from 'react-router';
import styled from 'styled-components';
import { LinkBlue, GlyphiconBlue } from 'components/shared/Project/styled'

const LinkCommit = styled(Link)`
  color: #586069;
`

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
      oid,
      commitTime,
    },
    object,
  },
  relay: {
    variables,
  },
}) => (
  <tr>
    <td>
      <LinkBlue
        to={
          getTreeEntryPath(variables, type, name)
        }
      >
        <span style={{ paddingRight: 10 }}>{iconType(type)}</span>
        {shortName(name, variables.splat)}
      </LinkBlue>
    </td>
    <td>{byteSize(object)}</td>
    <td>
      <LinkCommit to={getCommitPath(variables, oid)}>
        {shortMessage}
      </LinkCommit>
    </td>
    <td style={{ textAlign: 'right' }}>{moment.unix(commitTime).fromNow()}</td>
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
    splat: null,
  },
  fragments: {
    treeEntry: () => Relay.QL`
      fragment on TreeEntry {
        name
        type
        lastCommit(refName: $branchHead) {
          shortMessage
          oid
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
