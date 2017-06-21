import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col, Tabs, Tab, Badge } from 'react-bootstrap';
import DiagramInfo from '../DiagramInfo';
import ChildsDiagram from '../ChildsDiagram';

const MainContainer = styled.div`
  padding: 20px;
`

const ChildContainer = styled.div`
  padding: 0 20px;
`

const PalettDiv = styled.div`
  border: solid 1px rgba(0,0,0,0.3);
  border-right: none;
  height: 620px;
  background: rgba(0,0,0,0.04);
`

const CanvasDiv = styled.div`
  border: solid 1px rgba(0,0,0,0.3);
  height: 620px;
  & textarea {
    background: white !important;
    border: solid 1px rgba(0,0,0,0.3) !important;
  }
`

const ColFit = styled(Col)`
  padding: 0;
  margin-top: 15px;
  margin-bottom: 15px;
`

const DescriptionTabs = styled(Tabs)`
  margin-left: 10px;
  height: 620px;
`

const DefaultTab = styled(Tab)`
  border: solid 1px #dddddd;
  border-top: 0;
  height: 580px;
  padding: 20px;
  background: #fcfcfc;
`

const childTitle = titleCount => (
  <span>
    Child Diagrams
    {' '}
    <Badge>{titleCount}</Badge>
  </span>
)

const DiagramContainer = ({
  isModified, handleSave, diagram, variables, children, totalChilds,
  diagramName, diagramDescription, onNameChange, onDescriptionChange,
  activeTabKey, updateActiveTabKey,
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
          <DescriptionTabs
            activeKey={activeTabKey}
            id={'diagramEditorTabs'}
            onSelect={key => updateActiveTabKey(key)}
          >
            <DefaultTab eventKey={1} title={'Diagram Info'}>
              <DiagramInfo
                diagramInfo={diagram}
                isModified={isModified}
                handleSave={handleSave}
                onNameChange={onNameChange}
                onDescriptionChange={onDescriptionChange}
                diagramName={diagramName}
                diagramDescription={diagramDescription}
                updateActiveTabKey={updateActiveTabKey}
                {...variables}
              />
            </DefaultTab>
            <DefaultTab eventKey={2} title={childTitle(totalChilds)}>
              <ChildsDiagram
                childsDiagram={diagram}
                {...variables}
              />
            </DefaultTab>
          </DescriptionTabs>
        </ColFit>
      </Row>
      { children }
    </ChildContainer>
  </MainContainer>

DiagramContainer.propTypes = {
  children: PropTypes.node.isRequired,
  isModified: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  diagram: PropTypes.object,
  totalChilds: PropTypes.number.isRequired,
  diagramName: PropTypes.string.isRequired,
  diagramDescription: PropTypes.string.isRequired,
  activeTabKey: PropTypes.number.isRequired,
  updateActiveTabKey: PropTypes.func.isRequired,
  variables: PropTypes.object,
}

export default DiagramContainer
