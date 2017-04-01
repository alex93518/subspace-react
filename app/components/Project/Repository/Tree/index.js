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
  projectPath,
  relay,
}) => (
  <TableWhite hover>
    <tbody>
      {relay.variables.splat ?
        <FolderUp
          branchHead={relay.variables.branchHead}
          path={relay.variables.splat}
          projectPath={projectPath}
        /> : null
      }
      {sortEntries(entries).map(treeEntry =>
        <TreeEntry
          key={treeEntry.oid}
          treeEntry={treeEntry}
          branchHead={relay.variables.branchHead}
          path={relay.variables.splat}
          projectPath={projectPath}
        />
      )}
    </tbody>
  </TableWhite>
)

Tree.propTypes = {
  tree: PropTypes.object.isRequired,
  projectPath: PropTypes.string.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Tree, {
  initialVariables: {
    branchHead: 'refs/heads/master',
    splat: '',
  },
  fragments: {
    tree: ({ branchHead }) => Relay.QL`
      fragment on Tree {
        entries(path: $splat) {
          oid
          type
          name
          ${TreeEntry.getFragment('treeEntry', { branchHead })}
        }
      }
    `,
  },
})
