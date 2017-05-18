import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { createContainer } from 'recompose-relay'
import {
  compose, withState, withHandlers, branch, renderComponent,
} from 'recompose';
import R from 'ramda';
import styled from 'styled-components';
import uuid from 'uuid';
import { Row, Col, Tabs, Tab, Badge } from 'react-bootstrap';
import CurrentRelay, { UpsertDiagramModelMutation } from 'relay';
import { redirect } from 'redux/utils'
import { getDiagramPath } from 'utils/path'
import GoJsCanvas from '../GoJsCanvas';
import DiagramInfo from './DiagramInfo';
import ChildsDiagram from './ChildsDiagram';

const MainContainer = styled.div`
  padding: 20px;
`

const ChildContainer = styled.div`
  padding: 0 20px;
`

const PalettDiv = styled.div`
  border: solid 1px rgba(0,0,0,0.3);
  border-right: none;
  height: 620px;
  background: rgba(0,0,0,0.04);
`

const CanvasDiv = styled.div`
  border: solid 1px rgba(0,0,0,0.3);
  height: 620px;
  & textarea {
    background: white !important;
    border: solid 1px rgba(0,0,0,0.3) !important;
  }
`

const ColFit = styled(Col)`
  padding: 0;
  margin-top: 15px;
  margin-bottom: 15px;
`

const DescriptionTabs = styled(Tabs)`
  margin-left: 10px;
  height: 620px;
`

const DefaultTab = styled(Tab)`
  border: solid 1px #dddddd;
  border-top: 0;
  height: 580px;
  padding: 20px;
  background: #fcfcfc;
`

const childTitle = titleCount => (
  <span>
    Child Diagrams
    {' '}
    <Badge>{titleCount}</Badge>
  </span>
)

const DiagramContainer = ({
  isModified, handleSave, diagram, variables, children, totalChilds,
  diagramName, diagramDescription, onNameChange, onDescriptionChange,
  activeTabKey, updateActiveTabKey,
}) =>
  <MainContainer>
    <ChildContainer>
      <Row>
        <ColFit md={2}>
          <PalettDiv id="mainPalette" />
        </ColFit>
        <ColFit md={7}>
          <CanvasDiv id="canvasEditor" />
        </ColFit>
        <ColFit md={3}>
          <DescriptionTabs
            activeKey={activeTabKey}
            id={'diagramEditorTabs'}
            onSelect={key => updateActiveTabKey(key)}
          >
            <DefaultTab eventKey={1} title={'Diagram Info'}>
              <DiagramInfo
                diagramInfo={diagram}
                isModified={isModified}
                handleSave={handleSave}
                onNameChange={onNameChange}
                onDescriptionChange={onDescriptionChange}
                diagramName={diagramName}
                diagramDescription={diagramDescription}
                updateActiveTabKey={updateActiveTabKey}
                {...variables}
              />
            </DefaultTab>
            <DefaultTab eventKey={2} title={childTitle(totalChilds)}>
              <ChildsDiagram
                childsDiagram={diagram}
                {...variables}
              />
            </DefaultTab>
          </DescriptionTabs>
        </ColFit>
      </Row>
      { children }
    </ChildContainer>
  </MainContainer>

DiagramContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isModified: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  diagram: PropTypes.object,
  totalChilds: PropTypes.number.isRequired,
  diagramName: PropTypes.string.isRequired,
  diagramDescription: PropTypes.string.isRequired,
  activeTabKey: PropTypes.number.isRequired,
  updateActiveTabKey: PropTypes.func.isRequired,
  variables: PropTypes.object,
}

const DiagramEditor = ({
  diagramEditor: { diagrams: { edges } },
  relay: { variables },
  repositoryId,
  repositoryRawId,
  isModified,
  onNameChange,
  onDescriptionChange,
  onModelChange,
  diagramName,
  diagramDescription,
  activeTabKey,
  updateActiveTabKey,
  handleSave,
}) => (
  <DiagramContainer
    isModified={isModified}
    handleSave={handleSave}
    diagram={edges ? edges[0].node : {}}
    onNameChange={onNameChange}
    onDescriptionChange={onDescriptionChange}
    totalChilds={edges ? edges[0].node.childs.totalCount : 0}
    diagramName={diagramName}
    diagramDescription={diagramDescription}
    activeTabKey={activeTabKey}
    updateActiveTabKey={updateActiveTabKey}
    variables={variables}
  >
    {
      edges && edges.map(({ node }) =>
        <GoJsCanvas
          key={node.id}
          diagram={node}
          repositoryId={repositoryId}
          repositoryRawId={repositoryRawId}
          onModelChange={onModelChange}
          {...variables}
        />
      )
    }
  </DiagramContainer>
)

DiagramEditor.propTypes = {
  diagramEditor: PropTypes.object,
  relay: PropTypes.object.isRequired,
  repositoryId: PropTypes.string.isRequired,
  repositoryRawId: PropTypes.string.isRequired,
  isModified: PropTypes.bool.isRequired,
  onModelChange: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  diagramName: PropTypes.string.isRequired,
  diagramDescription: PropTypes.string.isRequired,
  activeTabKey: PropTypes.number.isRequired,
  updateActiveTabKey: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
}

DiagramEditor.defaultProps = {
  isNew: false,
  repositoryId: null,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
      diagramId: null,
    },
    fragments: {
      diagramEditor: vars => Relay.QL`
        fragment on Repository {
          diagrams(diagramId: $diagramId, first: 1) {
            edges {
              node {
                id
                childs {
                  totalCount
                }
                ${DiagramInfo.getFragment('diagramInfo', vars)}
                ${ChildsDiagram.getFragment('childsDiagram', vars)}
                ${GoJsCanvas.getFragment('diagram', vars)}
              }
            }
          }
        }
      `,
    },
  }),
  withState('isModified', 'updateIsModified', false),
  withState('diagramData', 'updateDiagramData', {
    model: '', svg: '', svgThumb: '',
  }),
  withState('diagramName', 'onNameChange', ''),
  withState('diagramDescription', 'onDescriptionChange', ''),
  withState('activeTabKey', 'updateActiveTabKey', 1),
  withHandlers({
    onModelChange: props => diagramData => {
      props.updateDiagramData(diagramData)
      props.updateIsModified(true)
    },
    handleSave: ({
      repositoryId, repositoryRawId, updateIsModified,
      diagramName, diagramDescription,
      diagramData: { model, svg, svgThumb },
      relay: { variables: { userName, projectName, diagramId } },
    }) => () => {
      // Change width & heigth {class {NaN}} to 0
      const modelTransform = ({ nodeDataArray, ...vars }) => ({
        nodeDataArray: R.map(
          ({ width, height, ...rest }) => ({
            width: width.class ? 0 : width,
            height: height.class ? 0 : height,
            ...rest,
          }),
          nodeDataArray
        ),
        ...vars,
      })
      const relayModel = JSON.stringify(modelTransform(JSON.parse(model)))
      const childId = uuid.v4()
      CurrentRelay.Store.commitUpdate(
        new UpsertDiagramModelMutation({
          diagramId: childId,
          repositoryRawId,
          repositoryId,
          model: relayModel,
          parentDiagramId: diagramId,
          name: diagramName,
          description: diagramDescription,
          svg,
          svgThumb,
        }),
        {
          onSuccess: () => {
            updateIsModified(false)
            const diagramPath = getDiagramPath({
              userName,
              projectName,
              diagramId: childId,
            })
            redirect(diagramPath)
          },
          onFailure: transaction => console.log(transaction.getError()),
        }
      )
    },
  }),
  branch(
    props => props.isNew,
    renderComponent(({
      isModified,
      handleSave,
      onModelChange,
      onNameChange,
      onDescriptionChange,
      repositoryId,
      diagramName,
      diagramDescription,
      activeTabKey,
      updateActiveTabKey,
      repositoryRawId,
    }) =>
      <DiagramContainer
        isModified={isModified}
        handleSave={handleSave}
        onNameChange={onNameChange}
        onDescriptionChange={onDescriptionChange}
        diagram={null}
        diagramName={diagramName}
        diagramDescription={diagramDescription}
        activeTabKey={activeTabKey}
        updateActiveTabKey={updateActiveTabKey}
        totalChilds={0}
      >
        <GoJsCanvas
          isNew
          diagram={null}
          repositoryId={repositoryId}
          repositoryRawId={repositoryRawId}
          onModelChange={onModelChange}
        />
      </DiagramContainer>
    )
  )
)(DiagramEditor)
