import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { toGoJsModel } from 'utils/gojs/toGoJsModel';
import { renderCanvas } from 'utils/gojs/renderCanvas';
import CurrentRelay, {
  UpdateDiagramObjectMutation,
  DeleteDiagramObjectMutation,
  UpdateDiagramLinkMutation,
  DeleteDiagramLinkMutation,
} from 'relay';

const handleObjectChanged = ({
  key, width, height, figure, loc, text,
}, diagramId) => {
  CurrentRelay.Store.commitUpdate(
    new UpdateDiagramObjectMutation({
      key, width, height, figure, loc, text, diagramId,
    }),
    {
      onSuccess: () => {},
      onFailure: transaction => console.log(transaction.getError()),
    }
  )
}

const handleObjectDelete = (diagramId, objectId) => {
  CurrentRelay.Store.commitUpdate(
    new DeleteDiagramObjectMutation({
      diagramId,
      objectId,
    }),
    {
      onSuccess: () => {},
      onFailure: transaction => console.log(transaction.getError()),
    }
  )
}

const handleLinkChanged = ({
  linkId, from, to, visible, text, description, points,
}, diagramId) => {
  CurrentRelay.Store.commitUpdate(
    new UpdateDiagramLinkMutation({
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
}

const handleLinkDelete = (diagramId, linkId) => {
  CurrentRelay.Store.commitUpdate(
    new DeleteDiagramLinkMutation({
      diagramId,
      linkId,
    }),
    {
      onSuccess: () => {},
      onFailure: transaction => console.log(transaction.getError()),
    }
  )
}

class GoJsCanvas extends Component {
  componentDidMount() {
    const { diagramId } = this.props.relay.variables
    const model = toGoJsModel(this.props.diagram)
    renderCanvas(
      data => handleObjectChanged(data, diagramId),
      objectId => handleObjectDelete(diagramId, objectId),
      data => handleLinkChanged(data, diagramId),
      linkId => handleLinkDelete(diagramId, linkId),
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
  diagram: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(GoJsCanvas, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    diagramId: null,
  },
  fragments: {
    diagram: () => Relay.QL`
      fragment on Diagram {
        rawId
        objects(first: 999999) {
          edges {
            node {
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
});
