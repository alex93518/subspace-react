import React, { Component } from 'react';
import { renderCanvas } from 'utils/gojs/renderCanvas';

class GoJsCanvas extends Component {
  componentDidMount() {
    renderCanvas(() => {}, {});
  }

  render() {
    return (
      <span />
    )
  }
}

export default GoJsCanvas;
