import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import BranchSelect from './BranchSelect';
import Tree from './Tree';
import Blob from './Blob';
import Readme from './Readme';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const Repository = ({
  projectPath,
  repository,
  repository: {
    ref,
  },
  relay: {
    variables,
  },
}) => (
  <Col md={12}>
    <RowSty>
      <Col>
        <BranchSelect
          branchSelect={repository}
          projectPath={projectPath}
          currentBranch={variables.branchHead}
        />
      </Col>
    </RowSty>
    <RowSty>
      <Col>
        {variables.isTree ?
          <Tree
            tree={ref.target.tree}
            splat={variables.splat}
            branchHead={variables.branchHead}
            projectPath={projectPath}
          /> :
          <Blob
            blob={ref.target.tree}
            splat={variables.splat}
          />
        }
      </Col>
    </RowSty>
    <Row>
      <Col>
        {
          variables.isBase &&
          <Readme readme={ref.target.readme} />
        }
      </Col>
    </Row>
  </Col>
)

Repository.propTypes = {
  repository: PropTypes.object.isRequired,
  projectPath: PropTypes.string.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Repository, {
  initialVariables: {
    splat: '',
    isBase: true,
    isTree: true,
    branchHead: 'master',
  },
  prepareVariables: vars => ({
    ...vars,
    isBase: !vars.splat,
  }),
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
                ${Readme.getFragment('readme')}
              }
            }
          }
        }
      }
    `,
  },
})
