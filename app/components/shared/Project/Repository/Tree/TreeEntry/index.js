import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import styled from 'styled-components';
import { LinkTreeEntry, LinkCommit } from 'components/shared/Links';
import { GoFileDirectory, GoFileText } from 'react-icons/lib/go';
import { bytesToSize } from 'utils/string';

const IconBlue = styled.span`
  color: rgba(3,47,98,0.5);
  font-size: 14px;
  margin-left: 2px;
`

const LinkTree = styled(LinkTreeEntry)`
  color: #0366d6;
`

const LinkCommitMsg = styled(LinkCommit)`
  color: #0366d6;
`

const TdBytes = styled.td`
  text-align: right;
  margin-right: 20px;
`

const TdTime = styled.td`
  text-align: right;
`

const iconType = type => (
  <IconBlue>
    {type === 'blob' ? <GoFileText /> : <GoFileDirectory />}
  </IconBlue>
)

const byteSize = obj => obj.byteSize ? bytesToSize(obj.byteSize, 2) : ''
const shortName = (name, path) => path ? name.replace(`${path}/`, '') : name

const TreeEntry = ({
  treeEntry: {
    name,
    type,
    history: { edges },
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
    <TdBytes>{byteSize(object)}</TdBytes>
    <td>
      <LinkCommitMsg vars={{ ...variables, commitId: edges[0].node.oid }}>
        {edges[0].node.shortMessage}
      </LinkCommitMsg>
    </td>
    <TdTime>{moment.unix(edges[0].node.commitTime).fromNow()}</TdTime>
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
        history(first: 1, refName: $branchHead) {
          edges {
            node {
              shortMessage
              oid
              commitTime
            }
          }
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
