import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { createContainer } from 'recompose-relay'
import { compose, mapProps, withState, withHandlers } from 'recompose';
import uuid from 'uuid';
import { renderCanvas } from 'utils/gojs/renderCanvas';

class GoJsCanvas extends Component {
  componentDidMount() {
    const {
      model, onModelChange, onCanvasEditorChanged,
    } = this.props

    const { canvasEditor } = renderCanvas(
      onModelChange,
      model
    );

    onCanvasEditorChanged(canvasEditor)
  }

  componentWillUnmount() {
    const { onCanvasEditorChanged } = this.props
    onCanvasEditorChanged(null);
  }

  render() {
    return (
      <span />
    )
  }
}

GoJsCanvas.propTypes = {
  model: PropTypes.object.isRequired,
  onModelChange: PropTypes.func,
  onCanvasEditorChanged: PropTypes.func.isRequired,
}

GoJsCanvas.defaultProp = {
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
      diagram: () => Relay.QL`
        fragment on Diagram {
          id
          rawId
          objects(first: 999999) {
            edges {
              node {
                id
                objectId
                figure
                text
                loc
                width
                height
              }
            }
          }
          links(first: 999999) {
            edges {
              node {
                linkId
                fromDiagramObjId
                toDiagramObjId,
                visible,
                text,
                description,
                points,              
              }
            }
          }
        }
      `,
    },
  }),
  mapProps(({ diagram, isNew, relay, ...vars }) => ({
    diagramId: isNew ? uuid.v4() : relay.variables.diagramId,
    model: isNew ? {
      class: 'go.GraphLinksModel',
      nodeDataArray: [],
      linkDataArray: [],
    } : {
      class: 'go.GraphLinksModel',
      nodeDataArray: diagram.objects ?
        diagram.objects.edges.map(({ node }) => ({
          ...node,
          key: node.objectId,
          width: node.width || { class: 'NaN' },
          height: node.height || { class: 'NaN' },
        })) : [],
      linkDataArray: diagram.links ?
        diagram.links.edges.map(({ node }) => ({
          ...node,
          from: node.fromDiagramObjId,
          to: node.toDiagramObjId,
          points: node.points ? JSON.parse(node.points) : null,
        })) : [],
    },
    id: diagram ? diagram.id : null,
    ...vars,
  })),
  withState('canvasEditor', 'updateCanvasEditor', null),
  withHandlers({
    onSaved: props => () => {
      props.canvasEditor.isModified = false;
    },
    onCanvasEditorChanged: props => canvasEditor => {
      props.updateCanvasEditor(canvasEditor)
    },
  }),
)(GoJsCanvas)
