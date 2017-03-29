import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components'
import { Col, Table, Glyphicon } from 'react-bootstrap';
import TreeEntry from './TreeEntry';

const FilesCol = styled(Col)`
  padding-top: 15px;
`

const parentFolderUp = (onRowClick, relay) => {
  const upPath = relay.variables.path.split('/')
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

const treeEntryType = (type, entries, onRowClick, relay) =>
  entries
    .filter(val => val.type === type)
    .sort(sortByName)
    .map(treeEntry =>
      <TreeEntry
        key={treeEntry.oid}
        treeEntry={treeEntry}
        branchHead={relay.variables.branchHead}
        path={relay.variables.path}
        onRowClick={path => onRowClick(type === 'tree', path)}
      />
    )


const sortByName = (a, b) => {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA < nameB) return -1
  if (nameA > nameB) return 1
  return 0
}

const Tree = ({
  tree: {
    entries,
  },
  onRowClick,
  relay,
}) => (
  <FilesCol md={12}>
    <Table hover responsive>
      <tbody>
        {relay.variables.path ? parentFolderUp(onRowClick, relay) : null}
        {treeEntryType('tree', entries, onRowClick, relay)}
        {treeEntryType('blob', entries, onRowClick, relay)}
      </tbody>
    </Table>
  </FilesCol>
)

Tree.propTypes = {
  tree: PropTypes.object.isRequired,
  onRowClick: PropTypes.func.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Tree, {
  initialVariables: {
    branchHead: 'refs/heads/master',
    path: '',
  },
  fragments: {
    tree: ({ branchHead }) => Relay.QL`
      fragment on Tree {
        entries(path: $path) {
          oid
          type
          name
          ${TreeEntry.getFragment('treeEntry', { branchHead })}
        }
      }
    `,
  },
})
