import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components'
import { Row, Col, FormControl } from 'react-bootstrap';
import Tree from './Tree';
import Blob from './Blob';

const FilesCol = styled(Col)`
  padding-top: 15px;
`

const Repository = ({
  repository: {
    refs,
    ref,
  },
  relay,
  onRowClick,
}) => (
  <div>
    <FilesCol md={12}>
      <Row>
        Branch:
        <FormControl
          name="branch"
          componentClass="select"
          onChange={e => onRowClick(
            relay.variables.isTree,
            relay.variables.path,
            e.target.value
          )}
        >
          {refs.edges.map(refNode => {
            const name = refNode.node.name.replace('refs/heads/', '')
            return (<option key={name} value={name}>
              {name}
            </option>)
          })}
        </FormControl>
      </Row>
    </FilesCol>
    {relay.variables.isTree ?
      <Tree
        tree={ref.target.tree}
        path={relay.variables.path}
        branchHead={relay.variables.branchHead}
        onRowClick={(isTree, path) =>
          onRowClick(isTree, path, relay.variables.branchHead)
        }
      /> :
      <Blob
        blob={ref.target.tree}
        path={relay.variables.path}
      />
    }
  </div>
)

Repository.propTypes = {
  repository: PropTypes.object.isRequired,
  onRowClick: PropTypes.func.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Repository, {
  initialVariables: {
    path: '',
    isTree: true,
    branchHead: 'master',
  },
  fragments: {
    repository: ({ branchHead, path }) => Relay.QL`
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
              tree @include(if: $isTree) {
                ${Tree.getFragment('tree', { branchHead, path })}
              }
              tree @skip(if: $isTree) {
                ${Blob.getFragment('blob', { path })}
              }
            }
          }
        }
      }
    `,
  },
})
