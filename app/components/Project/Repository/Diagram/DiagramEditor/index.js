import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { createContainer } from 'recompose-relay'
import {
  compose, withState, withHandlers, branch, renderComponent,
} from 'recompose';
import R from 'ramda';
import styled from 'styled-components';
import uuid from 'uuid';
import { Row, Col, Button } from 'react-bootstrap';
import CurrentRelay, { UpsertDiagramModelMutation } from 'relay';
import GoJsCanvas from '../GoJsCanvas';
import ChildDiagram from './ChildDiagram';

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

const DescriptionDiv = styled.div`
  border: solid 1px rgba(0,0,0,0.3);
  border-left: none;
  padding: 20px;
  height: 620px;
`

const ColFit = styled(Col)`
  padding: 0;
  margin-top: 15px;
  margin-bottom: 15px;
`

const DiagramContainer = ({
  isModified, handleSave, childs, variables, children,
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
          <DescriptionDiv>
            <div>
              {isModified ? 'modified' : 'not modified'}
            </div>
            <div>
              <Button
                onClick={handleSave}
                disabled={!isModified}
              >
                Save
              </Button>
            </div>
            <div>
              Description
            </div>
            {childs &&
            <div>
              <h3>Childs / Revisions</h3>
              {childs.map(({ node }) =>
                <ChildDiagram
                  key={node.id}
                  childDiagram={node}
                  {...variables}
                />
              )}
            </div>
            }
          </DescriptionDiv>
        </ColFit>
      </Row>
      { children }
    </ChildContainer>
  </MainContainer>

DiagramContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isModified: PropTypes.bool.isRequired,
  childs: PropTypes.array.isRequired,
  handleSave: PropTypes.func.isRequired,
  variables: PropTypes.object,
}

const DiagramEditor = ({
  diagramEditor: { diagrams: { edges } },
  relay: { variables },
  repositoryId,
  repositoryRawId,
  isModified,
  onModifiedChange,
  onModelChange,
  handleSave,
}) => {
  const childs = edges ? edges[0].node.childs.edges : []
  return (
    <DiagramContainer
      isModified={isModified}
      handleSave={handleSave}
      childs={childs}
      variables={variables}
    >
      {
        edges && edges.map(({ node }) =>
          <GoJsCanvas
            key={node.id}
            diagram={node}
            repositoryId={repositoryId}
            repositoryRawId={repositoryRawId}
            onModifiedChange={onModifiedChange}
            onModelChange={onModelChange}
            {...variables}
          />
        )
      }
    </DiagramContainer>
  )
}

DiagramEditor.propTypes = {
  diagramEditor: PropTypes.object,
  relay: PropTypes.object.isRequired,
  repositoryId: PropTypes.string.isRequired,
  repositoryRawId: PropTypes.string.isRequired,
  isModified: PropTypes.bool.isRequired,
  onModifiedChange: PropTypes.func.isRequired,
  onModelChange: PropTypes.func.isRequired,
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
                childs(first: 99) {
                  edges {
                    node {
                      id
                      ${ChildDiagram.getFragment('childDiagram', vars)}
                    }
                  }
                }
                ${GoJsCanvas.getFragment('diagram', vars)}                
              }
            }
          }
        }
      `,
    },
  }),
  withState('isModified', 'updateIsModified', false),
  withState('model', 'updateModel', ''),
  withState('svg', 'updateSvg', ''),
  withHandlers({
    onModifiedChange: props => isModified => {
      props.updateIsModified(isModified)
    },
    onModelChange: props => ({ model, svg }) => {
      props.updateModel(model)
      props.updateSvg(svg)
    },
    handleSave: ({
      repositoryId, repositoryRawId, model, svg, updateIsModified,
      relay: { variables: { diagramId } },
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
      CurrentRelay.Store.commitUpdate(
        new UpsertDiagramModelMutation({
          diagramId: uuid.v4(),
          repositoryRawId,
          repositoryId,
          model: relayModel,
          svg,
          parentDiagramId: diagramId,
        }),
        {
          onSuccess: () => {
            updateIsModified(false)
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
      onModifiedChange,
      handleSave,
      onModelChange,
      repositoryId,
      repositoryRawId,
    }) =>
      <DiagramContainer
        isModified={isModified}
        handleSave={handleSave}
        childs={[]}
      >
        <GoJsCanvas
          isNew
          diagram={null}
          repositoryId={repositoryId}
          repositoryRawId={repositoryRawId}
          onModifiedChange={onModifiedChange}
          onModelChange={onModelChange}
        />
      </DiagramContainer>
    )
  )
)(DiagramEditor)
