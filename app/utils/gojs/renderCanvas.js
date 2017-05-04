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
    const idx = document.title.indexOf(' - Draft *');
    if (canvasEditor.isModified) {
      if (idx < 0) document.title += ' - Draft *';
    } else if (idx >= 0) document.title = document.title.substr(0, idx);
  });

  // Manipulate object after dropped from palette to canvas
  canvasEditor.addDiagramListener('ExternalObjectsDropped', () => {
    canvasEditor.selection.each(({ part, part: { data } }) => {
      // Change the object width and height
      canvasEditor.model.setDataProperty(data, 'width', data.width * 1.7)
      canvasEditor.model.setDataProperty(data, 'height', data.height * 1.7)

      // Change focus to textBox
      canvasEditor.commandHandler.editTextBlock(part.findObject('TEXTLABEL'))
    });
  })

  // Callback function on model changed
  canvasEditor.addModelChangedListener(e => {
    if (e.isTransactionFinished) {
      console.log(JSON.parse(canvasEditor.model.toJson()))
      handleModelChanged(JSON.parse(canvasEditor.model.toJson()))
    }
  })

  // Auto resize shape when text edited
  canvasEditor.addDiagramListener('TextEdited', e => {
    if (e.subject.text !== '') {
      canvasEditor.selection.each(({ part: { data } }) => {
        // Change the object width and height
        canvasEditor.model.setDataProperty(data, 'width', NaN)
        canvasEditor.model.setDataProperty(data, 'height', NaN)
      });
    }
  })

  // Focus text on double click
  canvasEditor.addDiagramListener('ObjectDoubleClicked', () => {
    canvasEditor.selection.each(({ part }) => {
      canvasEditor.commandHandler.editTextBlock(part.findObject('TEXTLABEL'))
    });
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

  function nodeStyle() {
    return [
      // The Node.location comes from the "loc" property of the node data,
      // converted by the Point.parse static method.
      // If the Node.location is changed, it updates the "loc" property of the node data,
      // converting back using the Point.stringify static method.
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      {
        // the Node.location is at the center of each node
        locationSpot: go.Spot.Center,
        selectionAdorned: false,  // no selection handle when selected
        resizable: true,
        resizeObjectName: 'SHAPE',  // user can resize the Shape
        // isShadowed: true,
        // shadowColor: "#888",
        // handle mouse enter/leave events to show/hide the ports
        mouseEnter(e, obj) { showPorts(obj.part, true); },
        mouseLeave(e, obj) { showPorts(obj.part, false); },
      },
    ];
  }

  canvasEditor.nodeTemplateMap.add('',  // the default category
    goObj(go.Node, 'Spot', nodeStyle(),
      // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
      goObj(go.Panel, 'Auto',
        {
          margin: new go.Margin(15, 5, 5, 5),
        },
        goObj(go.Shape, 'Rectangle',
          {
            name: 'SHAPE',
            stroke: 'rgba(0,0,0,0.9)',
            fill: 'rgba(255,255,255,1)',
          },
          new go.Binding('figure'),
          new go.Binding('width').makeTwoWay(),
          new go.Binding('height').makeTwoWay()
        ),
        goObj(go.TextBlock,
          {
            font: 'bold 11pt Helvetica, Arial, sans-serif',
            stroke: 'rgba(0,0,0,0.9)',
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
          },
          new go.Binding('text').makeTwoWay())
      ),
      // four named ports, one on each side:
      makePort('T', go.Spot.Top),
      makePort('L', go.Spot.Left),
      makePort('R', go.Spot.Right),
      makePort('B', go.Spot.Bottom)
    ));

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
    if (label !== null) label.visible = true;
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
