import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components'
import { Row, Col, FormControl } from 'react-bootstrap';
import TreeEntry from './TreeEntry';

const FilesCol = styled(Col)`
  padding-top: 15px;
`

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
      <Row>
        {ref.target.tree.entries.map(treeEntry =>
          <TreeEntry key={treeEntry.oid} treeEntry={treeEntry} />
        )}
      </Row>
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
    tree: () => Relay.QL`
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
                  ${TreeEntry.getFragment('treeEntry')}
                }
              }
            }
          }
        }
      }
    `,
  },
})
