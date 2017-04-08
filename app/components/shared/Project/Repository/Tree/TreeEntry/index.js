import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import styled from 'styled-components';
import { Glyphicon } from 'react-bootstrap';
import { LinkTreeEntry, LinkCommit } from 'components/shared/Links';

const GlyphTreeEntry = styled(Glyphicon)`
  color: rgba(3,47,98,0.5);
`

const LinkTree = styled(LinkTreeEntry)`
  color: #0366d6;
`

const LinkCommitMsg = styled(LinkCommit)`
  color: #0366d6;
`

const iconType = type => type === 'blob' ?
  <GlyphTreeEntry glyph="file" /> :
  <GlyphTreeEntry glyph="folder-open" />
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
      <LinkTree vars={{ ...variables, type, pathName: name }}>
        <span style={{ paddingRight: 10 }}>{iconType(type)}</span>
        {shortName(name, variables.splat)}
      </LinkTree>
    </td>
    <td>{byteSize(object)}</td>
    <td>
      <LinkCommitMsg vars={{ ...variables, commitId: oid }}>
        {shortMessage}
      </LinkCommitMsg>
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
