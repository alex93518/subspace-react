import React, { Component, PropTypes } from 'react';
import Relay from 'react-relay';
import { toGoJsModel } from 'utils/gojs/toGoJsModel';
import { renderCanvas } from 'utils/gojs/renderCanvas';

class GoJsCanvas extends Component {
  componentDidMount() {
    const model = toGoJsModel(this.props.diagram)
    renderCanvas(() => {}, model);
  }

  render() {
    return (
      <span />
    )
  }
}

GoJsCanvas.propTypes = {
  diagram: PropTypes.object.isRequired,
}

export default Relay.createContainer(GoJsCanvas, {
  fragments: {
    diagram: () => Relay.QL`
      fragment on Diagram {
        rawId
        objects {
          objectId
          figure
          text
          loc
          width
          height
        }
      }
    `,
  },
});
