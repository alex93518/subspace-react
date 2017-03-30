import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Table, Glyphicon } from 'react-bootstrap';
import R from 'ramda';
import TreeEntry from './TreeEntry';

const parentFolderUp = (onRowClick, relay) => {
  const upPath = relay.variables.splat.split('/')
  upPath.splice(-1, 1)
  const path = upPath.count === 0 ? '' : upPath.join('/')
  return (<tr // eslint-disable-line jsx-a11y/no-static-element-interactions
    onClick={() => onRowClick(true, path)}
    style={{ cursor: 'pointer' }}
  >
    <td colSpan="4">
      <span style={{ paddingRight: 10 }}>
        <Glyphicon glyph="folder-open" />
      </span>
      ..
    </td>
  </tr>)
}

const sortEntries = R.sortWith([
  R.descend(R.prop('type')),
  R.ascend(R.prop(name)),
])

const Tree = ({
  tree: {
    entries,
  },
  onRowClick,
  relay,
}) => (
  <Table hover responsive>
    <tbody>
      {relay.variables.splat ? parentFolderUp(onRowClick, relay) : null}
      {sortEntries(entries).map(treeEntry =>
        <TreeEntry
          key={treeEntry.oid}
          treeEntry={treeEntry}
          branchHead={relay.variables.branchHead}
          path={relay.variables.splat}
          onRowClick={path => onRowClick(treeEntry.type === 'tree', path)}
        />
      )}
    </tbody>
  </Table>
)

Tree.propTypes = {
  tree: PropTypes.object.isRequired,
  onRowClick: PropTypes.func.isRequired,
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
