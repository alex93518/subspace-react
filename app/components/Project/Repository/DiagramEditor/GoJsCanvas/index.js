import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { toGoJsModel } from 'utils/gojs/toGoJsModel';
import { renderCanvas } from 'utils/gojs/renderCanvas';
import CurrentRelay, {
  UpdateDiagramNodeMutation,
  DeleteDiagramNodeMutation,
} from 'relay';

const handleNodeChanged = ({ __gohashid, ...vars }, diagramId) => {
  CurrentRelay.Store.commitUpdate(
    new UpdateDiagramNodeMutation({
      ...vars,
      key: vars.key.toString(),
      diagramId,
    }),
    {
      onSuccess: () => {},
      onFailure: transaction => console.log(transaction.getError()),
    }
  )
}

const handleNodeDelete = (diagramId, objectId) => {
  CurrentRelay.Store.commitUpdate(
    new DeleteDiagramNodeMutation({
      diagramId,
      objectId,
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
      data => handleNodeChanged(data, diagramId),
      objectId => handleNodeDelete(diagramId, objectId),
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
      }
    `,
  },
});
