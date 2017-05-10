import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { createContainer } from 'recompose-relay'
import { compose, mapProps, withHandlers } from 'recompose';
import uuid from 'uuid';
import { renderCanvas } from 'utils/gojs/renderCanvas';
import CurrentRelay, {
  UpsertDiagramMutation,
  UpsertDiagramObjectMutation,
  DeleteDiagramObjectMutation,
  UpsertDiagramLinkMutation,
  DeleteDiagramLinkMutation,
} from 'relay';

const handleDiagramChanged = (
  diagramId, name, description, repositoryId,
  repositoryRawId, parentDiagramId, isDraft,
) => {
  CurrentRelay.Store.commitUpdate(
    new UpsertDiagramMutation({
      diagramId,
      name,
      description,
      repositoryId,
      repositoryRawId,
      parentDiagramId,
      isDraft,
    }),
    {
      onSuccess: () => {},
      onFailure: transaction => console.log(transaction.getError()),
    }
  )
}

class GoJsCanvas extends Component {
  componentDidMount() {
    const {
      diagramId, model, isNew, repositoryId, repositoryRawId,
      handleObjectChanged, handleLinkChanged,
      handleObjectDelete, handleLinkDelete,
    } = this.props

    if (isNew) {
      handleDiagramChanged(
        diagramId, null, null, repositoryId, repositoryRawId, null, true
      )
    }

    renderCanvas(
      handleObjectChanged,
      handleObjectDelete,
      handleLinkChanged,
      handleLinkDelete,
      model
    );
  }

  render() {
    return (
      <span />
    )
  }
}

GoJsCanvas.propTypes = {
  diagramId: PropTypes.string.isRequired,
  model: PropTypes.object.isRequired,
  isNew: PropTypes.bool,
  repositoryId: PropTypes.string,
  repositoryRawId: PropTypes.string,
  handleObjectChanged: PropTypes.func.isRequired,
  handleLinkChanged: PropTypes.func.isRequired,
  handleObjectDelete: PropTypes.func.isRequired,
  handleLinkDelete: PropTypes.func.isRequired,
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
  mapProps(({ diagram, isNew, relay, repositoryId, repositoryRawId }) => ({
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
    isNew,
    repositoryId,
    repositoryRawId,
    id: diagram ? diagram.id : null,
  })),
  withHandlers({
    handleObjectChanged: ({ id, diagramId }) => ({
      key, width, height, figure, loc, text,
    }) => {
      CurrentRelay.Store.commitUpdate(
        new UpsertDiagramObjectMutation({
          id, key, width, height, figure, loc, text, diagramId,
        }),
        {
          onSuccess: () => {},
          onFailure: transaction => console.log(transaction.getError()),
        }
      )
    },
    handleLinkChanged: ({ id, diagramId }) => ({
      linkId, from, to, visible, text, description, points,
    }) => {
      CurrentRelay.Store.commitUpdate(
        new UpsertDiagramLinkMutation({
          id,
          linkId,
          fromDiagramObjId: from,
          toDiagramObjId: to,
          visible,
          text,
          description,
          diagramId,
          points: JSON.stringify(points.n),
        }),
        {
          onSuccess: () => {},
          onFailure: transaction => console.log(transaction.getError()),
        }
      )
    },
    handleObjectDelete: ({ id, diagramId }) => objectId => {
      CurrentRelay.Store.commitUpdate(
        new DeleteDiagramObjectMutation({
          id,
          diagramId,
          objectId,
        }),
        {
          onSuccess: () => {},
          onFailure: transaction => console.log(transaction.getError()),
        }
      )
    },
    handleLinkDelete: ({ id, diagramId }) => linkId => {
      CurrentRelay.Store.commitUpdate(
        new DeleteDiagramLinkMutation({
          id,
          diagramId,
          linkId,
        }),
        {
          onSuccess: () => {},
          onFailure: transaction => console.log(transaction.getError()),
        }
      )
    },
  })
)(GoJsCanvas)
