import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Table } from 'react-bootstrap';
import styled from 'styled-components';
import R from 'ramda';
import TreeEntry from './TreeEntry';
import FolderUp from './FolderUp';

const sortEntries = R.sortWith([
  R.descend(R.prop('type')),
  R.ascend(R.prop(name)),
])

const TableWhite = styled(Table)`
  background: white;
  border: 1px solid #DDD;
`

const Tree = ({
  tree: {
    entries,
  },
  relay: {
    variables,
  },
}) => (
  <TableWhite hover>
    <tbody>
      {variables.splat ?
        <FolderUp
          {...variables}
        /> : null
      }
      {sortEntries(entries).map(treeEntry =>
        <TreeEntry
          {...variables}
          key={treeEntry.oid}
          treeEntry={treeEntry}
        />
      )}
    </tbody>
  </TableWhite>
)

Tree.propTypes = {
  tree: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Tree, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: '',
  },
  fragments: {
    tree: vars => Relay.QL`
      fragment on Tree {
        entries(path: $splat) {
          oid
          type
          name
          ${TreeEntry.getFragment('treeEntry', vars)}
        }
      }
    `,
  },
})
