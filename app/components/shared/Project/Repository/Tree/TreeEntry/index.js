import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import moment from 'moment';
import styled from 'styled-components';
import path from 'path';
import { LinkTreeEntry, LinkCommit } from 'components/shared/Links';
import GoFileDirectory from 'react-icons/lib/go/file-directory';
import GoFileText from 'react-icons/lib/go/file-text';
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

const TreeEntry = ({
  treeEntry: {
    name,
    type,
    history: { edges },
    object,
  },
}) => (
  <tr>
    <td>
      <LinkTree type={type} to={name}>
        <span style={{ paddingRight: 10 }}>{iconType(type)}</span>
        {path.basename(name)}
      </LinkTree>
    </td>
    <TdBytes>{byteSize(object)}</TdBytes>
    <td>
      <LinkCommitMsg to={edges[0].node.oid}>
        {edges[0].node.shortMessage}
      </LinkCommitMsg>
    </td>
    <TdTime>{moment.unix(edges[0].node.commitTime).fromNow()}</TdTime>
  </tr>
);

TreeEntry.propTypes = {
  treeEntry: PropTypes.object.isRequired,
};

export default createFragmentContainer(TreeEntry, {
  treeEntry: graphql`
    fragment TreeEntry_treeEntry on TreeEntry {
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
})
