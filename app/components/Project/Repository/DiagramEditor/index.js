import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import GoJsCanvas from './GoJsCanvas';

const MainContainer = styled.div`
  padding: 20px;
`

const ChildContainer = styled.div`
  padding: 0 20px;
`

const PalettDiv = styled.div`
  border: solid 1px rgba(0,0,0,0.3);
  border-right: none;
  height: 520px;
  background: rgba(0,0,0,0.04);
`

const CanvasDiv = styled.div`
  border: solid 1px rgba(0,0,0,0.3);
  height: 520px;
  & textarea {
    background: white !important;
    border: solid 1px rgba(0,0,0,0.3) !important;
  }
`

const DescriptionDiv = styled.div`
  border: solid 1px rgba(0,0,0,0.3);
  border-left: none;
  padding: 20px;
  height: 520px;
`

const ColFit = styled(Col)`
  padding: 0;
  margin-top: 15px;
  margin-bottom: 15px;
`

const DiagramEditor = ({
  diagramEditor: { diagrams: { edges } },
  relay: { variables },
}) =>
  <MainContainer>
    <ChildContainer>
      <Row>
        <ColFit md={2}>
          <PalettDiv id="mainPalette" />
        </ColFit>
        <ColFit md={7}>
          <CanvasDiv id="canvasEditor" />
        </ColFit>
        <ColFit md={3}>
          <DescriptionDiv>
            Description
          </DescriptionDiv>
        </ColFit>
      </Row>
      {
        edges && edges.map(({ node }) =>
          <GoJsCanvas key={node.id} diagram={node} {...variables} />
        )
      }
    </ChildContainer>
  </MainContainer>

DiagramEditor.propTypes = {
  diagramEditor: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(DiagramEditor, {
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
              ${GoJsCanvas.getFragment('diagram', vars)}
            }
          }
        }
      }
    `,
  },
})
