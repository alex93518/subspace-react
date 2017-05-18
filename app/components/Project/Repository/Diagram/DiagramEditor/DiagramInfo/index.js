import React, { Component, PropTypes } from 'react';
import { Button, ControlLabel, FormControl } from 'react-bootstrap';
import styled from 'styled-components';
import Relay from 'react-relay/classic';
import DiagramWidget from '../DiagramWidget';

const DivId = styled.div`
  margin-bottom: 15px;
`

const FormInput = styled(FormControl)`
  margin-bottom: 15px;
`

const DivSave = styled.div`
  text-align: right;
  margin-top: 25px;
`

class DiagramInfo extends Component {
  componentDidMount() {
    this.props.onNameChange(this.props.diagramInfo.name)
    this.props.onDescriptionChange(this.props.diagramInfo.description)
  }

  handleDiagramNameChange = event => {
    this.props.onNameChange(event.target.value)
  }

  handleDiagramDescriptionChange = event => {
    this.props.onDescriptionChange(event.target.value)
  }

  render() {
    const {
      diagramInfo, isModified, handleSave,
      diagramName, diagramDescription,
      relay: { variables },
    } = this.props
    return (
      <div>
        {
          diagramInfo && diagramInfo.rawId &&
          <DivId>
            ID: {diagramInfo.rawId}
          </DivId>
        }
        {
          diagramInfo && diagramInfo.parent &&
          <div>
            <ControlLabel>Parent Diagram</ControlLabel>
            <DiagramWidget
              key={diagramInfo.parent.id}
              diagramWidget={diagramInfo.parent}
              {...variables}
            />
          </div>
        }
        <ControlLabel>Title</ControlLabel>
        <FormInput
          id="formControlsTitle"
          type="text"
          label="Title"
          placeholder="Enter title"
          onChange={this.handleDiagramNameChange}
          value={diagramName}
        />
        <ControlLabel>Description</ControlLabel>
        <FormInput
          id="formControlsDescription"
          componentClass="textarea"
          placeholder="Enter description"
          rows={6}
          onChange={this.handleDiagramDescriptionChange}
          value={diagramDescription}
        />
        <DivSave>
          <Button
            onClick={handleSave}
            disabled={!isModified}
          >
            Save
          </Button>
        </DivSave>
      </div>
    )
  }
}

DiagramInfo.propTypes = {
  diagramInfo: PropTypes.object,
  isModified: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  diagramName: PropTypes.string.isRequired,
  diagramDescription: PropTypes.string.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(DiagramInfo, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    diagramInfo: vars => Relay.QL`
      fragment on Diagram {
        rawId
        name
        description
        parent {
          id
          ${DiagramWidget.getFragment('diagramWidget', vars)}
        }
      }
    `,
  },
})
