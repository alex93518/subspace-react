import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components'
import { Row, Col, FormControl, Table } from 'react-bootstrap';
import TreeEntry from './TreeEntry';

const FilesCol = styled(Col)`
  padding-top: 15px;
`

const sortByName = (a, b) => {
  const nameA = a.name.toUpperCase()
  const nameB = b.name.toUpperCase()
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  return 0;
}

const Tree = ({
  tree: {
    refs,
    ref,
  },
  relay,
}) => (
  <div>
    <FilesCol md={12}>
      <Row>
        Branch:
        <FormControl
          name="branch"
          componentClass="select"
          onChange={e => relay.setVariables({ branchHead: e.target.value })}
        >
          {refs.edges.map(refNode =>
            <option key={refNode.node.name} value={refNode.node.name}>
              {refNode.node.name}
            </option>
          )}
        </FormControl>
      </Row>
    </FilesCol>
    <FilesCol md={12}>
      <Table hover responsive>
        <tbody>
          {ref.target.tree.entries
            .filter(val => val.type === 'tree')
            .sort(sortByName)
            .map(treeEntry =>
              <TreeEntry
                key={treeEntry.oid}
                treeEntry={treeEntry}
                branchHead={relay.variables.branchHead}
              />
          )}
          {ref.target.tree.entries
            .filter(val => val.type === 'blob')
            .sort(sortByName)
            .map(treeEntry =>
              <TreeEntry
                key={treeEntry.oid}
                treeEntry={treeEntry}
                branchHead={relay.variables.branchHead}
              />
          )}
        </tbody>
      </Table>
    </FilesCol>
  </div>
)

Tree.propTypes = {
  tree: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Tree, {
  initialVariables: {
    branchHead: 'refs/heads/master',
  },
  fragments: {
    tree: ({ branchHead }) => Relay.QL`
      fragment on Repository {
        refs(first: 99) {
          edges {
            node {
              name
            }
          }
        }
        ref(refName: $branchHead) {
          name
          target {
            ... on Commit {
              tree {
                entries {
                  oid,
                  type,
                  name,
                  ${TreeEntry.getFragment('treeEntry', { branchHead })}
                }
              }
            }
          }
        }
      }
    `,
  },
})
