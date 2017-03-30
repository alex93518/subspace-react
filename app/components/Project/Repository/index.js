import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import RichTextEditor from 'react-rte';
import styled from 'styled-components'
import { Row, Col } from 'react-bootstrap';
import BranchSelect from './BranchSelect';
import Tree from './Tree';
import Blob from './Blob';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const Readme = (isBase, ref) => {
  if (isBase) {
    return ref.target.readme.entries.length ?
      <Blob
        blob={ref.target.readme}
        splat={'README.md'}
      /> :
      <RichTextEditor
        readOnly
        value={
          RichTextEditor.createValueFromString('No README.md file', 'html')
        }
      />
  }
  return null
}

const Repository = ({
  repository: {
    ref,
  },
  repository,
  relay,
  onRowClick,
}) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <BranchSelect
          branchSelect={repository}
          onRowClick={onRowClick}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        {relay.variables.isTree ?
          <Tree
            tree={ref.target.tree}
            splat={relay.variables.splat}
            branchHead={relay.variables.branchHead}
            onRowClick={(isTree, splat) =>
              onRowClick(isTree, splat, relay.variables.branchHead)
            }
          /> :
          <Blob
            blob={ref.target.tree}
            splat={relay.variables.splat}
          />
        }
      </Col>
    </RowSty>
    <Row>
      <Col>
        {Readme(relay.variables.isBase, ref)}
      </Col>
    </Row>
  </Col>
)

Repository.propTypes = {
  repository: PropTypes.object.isRequired,
  onRowClick: PropTypes.func.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Repository, {
  initialVariables: {
    splat: '',
    isBase: true,
    isTree: true,
    branchHead: 'master',
  },
  prepareVariables: vars => {
    if (!vars.splat) {
      return {
        ...vars,
        isBase: true,
      }
    }
    return {
      ...vars,
      isBase: false,
    }
  },
  fragments: {
    repository: ({ branchHead, splat }) => Relay.QL`
      fragment on Repository {
        ${BranchSelect.getFragment('branchSelect')}
        ref(refName: $branchHead) {
          name
          target {
            ... on Commit {
              tree @include(if: $isTree) {
                ${Tree.getFragment('tree', { branchHead, splat })}
              }
              tree @skip(if: $isTree) {
                ${Blob.getFragment('blob', { splat })}
              }
              readme: tree @include(if: $isBase) {
                entries(path: "README.md") {
                  oid
                }
                ${Blob.getFragment('blob', { splat: 'README.md' })}
              }
            }
          }
        }
      }
    `,
  },
})
