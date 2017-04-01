import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import Tree from 'components/shared/Project/Repository/Tree';
import Blob from 'components/shared/Project/Repository/Blob';
import Readme from './MainPage/Readme';
import StatusBar from './MainPage/StatusBar';
import MainPage from './MainPage';
import TreePage from './TreePage';
import BlobPage from './BlobPage';

const RowSty = styled(Row)`
  padding-top: 15px;
`

const child = (isBase, isTree, repository, ref, projectPath, relay) => {
  if (isBase) {
    return (
      <MainPage
        mainPage={repository}
        branchHead={relay.variables.branchHead}
        projectPath={projectPath}
      />
    )
  } else {
    if (isTree) {
      return (
        <TreePage
          treePage={repository}
          splat={relay.variables.splat}
          branchHead={relay.variables.branchHead}
          projectPath={projectPath}
        />
      )
    } else {
      return (
        <BlobPage
          blobPage={repository}
          branchHead={relay.variables.branchHead}
          splat={relay.variables.splat}
        />
      )
    }
  }
}

const Repository = ({
  repository: {
    ref,
  },
  repository,
  relay,
  projectPath,
}) => (
  <Col md={12}>
    <RowSty>
      <Col>
        {child(relay.variables.isBase, relay.variables.isTree, repository, ref, projectPath, relay)}
      </Col>
    </RowSty>
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
        ${MainPage.getFragment('mainPage', { branchHead })}
        ${TreePage.getFragment('treePage', { branchHead, splat })}
        ${BlobPage.getFragment('blobPage', { splat })}
      }
    `,
  },
})
