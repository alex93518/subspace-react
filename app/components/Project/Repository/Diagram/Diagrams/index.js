import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { compose } from 'recompose';
import { createContainer } from 'recompose-relay'
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  Masonry,
} from 'react-virtualized';
import Dimensions from 'react-dimensions'
import CreateNewDiagram from './CreateNewDiagram';
import DiagramInfo from './DiagramInfo';

class Diagrams extends Component {
  constructor(props) {
    super(props)

    this.columnCount = 0
    this.width = props.containerWidth

    this.cache = new CellMeasurerCache({
      defaultHeight: 280,
      defaultWidth: 280,
      fixedWidth: true,
    })

    this.columnHeights = {}

    this.state = {
      columnWidth: 280,
      gutterSize: 10,
    }

    this.cellRenderer = this.cellRenderer.bind(this)
    this.renderMasonry = this.renderMasonry.bind(this)
    this.setMasonryRef = this.setMasonryRef.bind(this)
  }

  calculateColumnCount() {
    const {
      columnWidth,
      gutterSize,
    } = this.state

    this.columnCount = Math.floor(this.width / (columnWidth + gutterSize))
  }

  cellRenderer({ index, key, parent, style }, list, variables) {
    const { columnWidth } = this.state
    return (
      <CellMeasurer
        cache={this.cache}
        index={index}
        key={key}
        parent={parent}
      >
        <div style={style} width={columnWidth}>
          {
            index === 0 ?
              <CreateNewDiagram key={'createNew'} variables={variables} /> :
              <DiagramInfo
                key={list[index - 1].node.id}
                diagramInfo={list[index - 1].node}
                {...variables}
              />
          }
        </div>
      </CellMeasurer>
    )
  }

  initCellPositioner() {
    if (typeof this.cellPositioner === 'undefined') {
      const {
        columnWidth,
        gutterSize,
      } = this.state

      this.cellPositioner = createMasonryCellPositioner({
        cellMeasurerCache: this.cache,
        columnCount: this.columnCount,
        columnWidth,
        spacer: gutterSize,
      })
    }
  }

  resetCellPositioner() {
    const {
      columnWidth,
      gutterSize,
    } = this.state

    this.cellPositioner.reset({
      columnCount: this.columnCount,
      columnWidth,
      spacer: gutterSize,
    })
  }

  setMasonryRef(ref) {
    this.masonry = ref
  }

  renderMasonry(edges, variables) {
    this.calculateColumnCount()
    this.initCellPositioner()

    return (
      <Masonry
        cellCount={edges.length + 1}
        cellMeasurerCache={this.cache}
        cellPositioner={this.cellPositioner}
        cellRenderer={props => this.cellRenderer(props, edges, variables)}
        ref={this.setMasonryRef}
        height={800}
        width={this.width}
      />
    )
  }

  render() {
    const {
      diagrams: { diagrams: { edges } },
      relay: { variables },
    } = this.props
    return this.renderMasonry(edges, variables)
  }
}

Diagrams.propTypes = {
  diagrams: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
  containerWidth: PropTypes.number.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      diagrams: vars => Relay.QL`
        fragment on Repository {
          diagrams(first: 99) {
            edges {
              node {
                id
                ${DiagramInfo.getFragment('diagramInfo', vars)}
              }
            }
          }
        }
      `,
    },
  }),
  Dimensions()
)(Diagrams)
