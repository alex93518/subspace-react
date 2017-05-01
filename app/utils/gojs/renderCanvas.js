import go from 'gojs';

const goObj = go.GraphObject.make;
export const renderCanvas = (handleModelChanged, modelData) => {
  const canvasEditor =
    goObj(go.Diagram, 'canvasEditor',  // must name or refer to the DIV HTML element
      {
        grid: goObj(go.Panel, 'Grid',
          goObj(go.Shape, 'LineH', { stroke: 'lightgray', strokeWidth: 0.3 }),
          goObj(go.Shape, 'LineH', { stroke: 'gray', strokeWidth: 0.3, interval: 10 }),
          goObj(go.Shape, 'LineV', { stroke: 'lightgray', strokeWidth: 0.3 }),
          goObj(go.Shape, 'LineV', { stroke: 'gray', strokeWidth: 0.3, interval: 10 })
        ),
        initialContentAlignment: go.Spot.Center,
        allowDrop: true,  // must be true to accept drops from the Palette
        LinkDrawn: showLinkLabel,  // this DiagramEvent listener is defined below
        LinkRelinked: showLinkLabel,
        'animationManager.duration': 600, // slightly longer than default (600ms) animation
        'undoManager.isEnabled': true,  // enable undo & redo
      }
    );

  // when the document is modified, add a "*" to the title and enable the "Save" button
  canvasEditor.addDiagramListener('Modified', () => {
    const button = document.getElementById('SaveButton');
    if (button) button.disabled = !canvasEditor.isModified;
    const idx = document.title.indexOf('*');
    if (canvasEditor.isModified) {
      if (idx < 0) document.title += '*';
    } else if (idx >= 0) document.title = document.title.substr(0, idx);
  });

  canvasEditor.addDiagramListener('ExternalObjectsDropped', () => {
    canvasEditor.selection.each(({ part: { data } }) => {
      canvasEditor.model.setDataProperty(data, 'width', data.width * 1.7)
      canvasEditor.model.setDataProperty(data, 'height', data.height * 1.7)
    });
  })

  canvasEditor.addModelChangedListener(e => {
    if (e.isTransactionFinished) {
      handleModelChanged(JSON.parse(canvasEditor.model.toJson()))
    }
  })

  // Define a function for creating a "port" that is normally transparent.
  // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
  // and where the port is positioned on the node, and the boolean "output" and "input" arguments
  // control whether the user can draw links from or to the port.
  function makePort(name, spot) {
    // the port is basically just a small circle that has a white stroke when it is made visible
    return goObj(go.Shape, 'Circle',
      {
        fill: 'transparent',
        stroke: null,  // this is changed to "white" in the showPorts function
        desiredSize: new go.Size(8, 8),
        alignment: spot,
        alignmentFocus: spot,  // align the port on the main Shape
        portId: name,  // declare this object to be a "port"
        fromSpot: spot,
        toSpot: spot,  // declare where links may connect at this port
        fromLinkable: true,
        toLinkable: true,  // declare whether the user may draw links to/from here
        cursor: 'pointer',  // show a different cursor to indicate potential link point
      }
    );
  }

  canvasEditor.nodeTemplateMap.add('',  // the default category
    goObj(go.Node, 'Spot',
      {
        locationSpot: go.Spot.Center,  // the location is the center of the Shape
        locationObjectName: 'SHAPE',
        selectionAdorned: false,  // no selection handle when selected
        resizable: true,
        resizeObjectName: 'SHAPE',  // user can resize the Shape
        rotatable: true,
        rotateObjectName: 'SHAPE',  // rotate the Shape without rotating the label
        // don't re-layout when node changes size
        mouseEnter(e, obj) { showPorts(obj.part, true); },
        mouseLeave(e, obj) { showPorts(obj.part, false); },
      },
      goObj(go.Shape,
        {
          name: 'SHAPE',  // named so that the above properties can refer to this GraphObject
          stroke: 'rgba(0, 0, 0, 0.9)',
          fill: 'rgba(255, 255, 255, 1)',
          strokeWidth: 1,
          margin: new go.Margin(15, 5, 5, 5),
        },
        // bind the Shape.figure to the figure name, which automatically gives the Shape a Geometry
        new go.Binding('figure', 'figure'),
        new go.Binding('width', 'width').makeTwoWay(),
        new go.Binding('height', 'height').makeTwoWay(),
        new go.Binding('angle', 'angle').makeTwoWay(),
      ),
      goObj(go.TextBlock,  // the label
        {
          margin: 4,
          font: 'bold 18px sans-serif',
          background: 'white',
        },
        new go.Binding('visible', 'isHighlighted').ofObject(),
        new go.Binding('text', 'key')
      ),
      new go.Binding('location', 'loc').makeTwoWay(),
      makePort('T', go.Spot.Top),
      makePort('L', go.Spot.Left),
      makePort('R', go.Spot.Right),
      makePort('B', go.Spot.Bottom)
    )
  );

  // replace the default Link template in the linkTemplateMap
  canvasEditor.linkTemplate =
    goObj(go.Link,  // the whole link panel
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        toShortLength: 4,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true,
        resegmentable: true,
        // mouse-overs subtly highlight links:
        mouseEnter(e, link) { link.findObject('HIGHLIGHT').stroke = 'rgba(30,144,255,0.2)'; },
        mouseLeave(e, link) { link.findObject('HIGHLIGHT').stroke = 'transparent'; },
      },
      new go.Binding('points').makeTwoWay(),
      goObj(go.Shape,  // the highlight shape, normally transparent
        { isPanelMain: true, strokeWidth: 8, stroke: 'transparent', name: 'HIGHLIGHT' }),
      goObj(go.Shape,  // the link path shape
        { isPanelMain: true, stroke: 'gray', strokeWidth: 2 }),
      goObj(go.Shape,  // the arrowhead
        { toArrow: 'standard', stroke: null, fill: 'gray' }),
      goObj(go.Panel, 'Auto',  // the link label, normally not visible
        { visible: false, name: 'LABEL', segmentIndex: 2, segmentFraction: 0.5 },
        new go.Binding('visible', 'visible').makeTwoWay(),
        goObj(go.Shape, 'RoundedRectangle',  // the label shape
          { fill: '#F8F8F8', stroke: null }),
        goObj(go.TextBlock, '',  // the label
          {
            textAlign: 'center',
            font: '10pt helvetica, arial, sans-serif',
            stroke: '#333333',
            editable: true,
          },
          new go.Binding('text').makeTwoWay()
        )
      )
    );

  // Make link labels visible if coming out of a "conditional" node.
  // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
  function showLinkLabel(e) {
    const label = e.subject.findObject('LABEL');
    if (label !== null) label.visible = (e.subject.fromNode.data.figure === 'Diamond');
  }

  // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
  canvasEditor.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
  canvasEditor.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
  canvasEditor.model = go.Model.fromJson(JSON.stringify(modelData));  // load an initial diagram from some JSON text

  // initialize the Palette that is on the left side of the page
  const size1 = { width: 36, height: 36 }
  const size2 = { width: 48, height: 36 }
  const mainPalette =
    goObj(go.Palette, 'mainPalette',  // must name or refer to the DIV HTML element
      {
        layout: goObj(go.GridLayout, { spacing: new go.Size(0, 0) }),
        'animationManager.duration': 800, // slightly longer than default (600ms) animation
        nodeTemplateMap: canvasEditor.nodeTemplateMap,  // share the templates used by myDiagram
        model: new go.GraphLinksModel([  // specify the contents of the Palette
          { figure: 'Circle', ...size1 },
          { figure: 'Ellipse', ...size2 },
          { figure: 'Rectangle', ...size2 },
          { figure: 'RoundedRectangle', ...size2 },
          { figure: 'Diamond', ...size1 },
          { figure: 'Parallelogram2', ...size2 },
          { figure: 'TriangleRight', ...size1 },
          { figure: 'Cylinder1', ...size1 },
          { figure: 'Hexagon', ...size1 },
          { figure: 'Procedure', ...size1 },
          { figure: 'Process', ...size1 },
        ]),
      }
    );

  // The following code overrides GoJS focus to stop the browser from scrolling
  // the page when either the Diagram or Palette are clicked or dragged onto.
  function customFocus() {
    const x = window.scrollX || window.pageXOffset;
    const y = window.scrollY || window.pageYOffset;
    go.Diagram.prototype.doFocus.call(this);
    window.scrollTo(x, y);
  }

  canvasEditor.doFocus = customFocus;
  mainPalette.doFocus = customFocus;

  return { canvasEditor, mainPalette }
}

function showPorts(node, show) {
  const diagram = node.diagram;
  if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
  node.ports.each(port => {
    port.stroke = (show ? 'rgba(0, 0, 0, 0.9)' : null);
  });
}
