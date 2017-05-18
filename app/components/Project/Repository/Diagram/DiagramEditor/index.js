import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay'
import {
  compose, withState, withHandlers, branch, renderComponent,
} from 'recompose';
import R from 'ramda';
import uuid from 'uuid';
import CurrentRelay, { UpsertDiagramModelMutation } from 'relay';
import { redirect } from 'redux/utils'
import { getDiagramPath } from 'utils/path'
import GoJsCanvas from '../GoJsCanvas';
import DiagramInfo from './DiagramInfo';
import ChildsDiagram from './ChildsDiagram';
import DiagramContainer from './DiagramContainer'

const DiagramEditor = ({
  diagramEditor: { diagrams: { edges } },
  relay: { variables },
  ...props
}) => (
  <DiagramContainer
    diagram={edges ? edges[0].node : {}}
    totalChilds={edges ? edges[0].node.childs.totalCount : 0}
    variables={variables}
    {...props}
  >
    {
      edges && edges.map(({ node }) =>
        <GoJsCanvas
          key={node.id}
          diagram={node}
          {...variables}
          {...props}
        />
      )
    }
  </DiagramContainer>
)

DiagramEditor.propTypes = {
  diagramEditor: PropTypes.object,
  relay: PropTypes.object.isRequired,
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
    renderComponent(props =>
      <DiagramContainer
        diagram={null}
        totalChilds={0}
        {...props}
      >
        <GoJsCanvas
          isNew
          diagram={null}
          {...props}
        />
      </DiagramContainer>
    )
  )
)(DiagramEditor)
