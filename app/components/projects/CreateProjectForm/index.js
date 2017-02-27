import React, { PropTypes } from 'react';
import { FormControl, Button, FormGroup, Radio } from 'react-bootstrap';
import RichTextEditor from 'react-rte';

class CreateProjectForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      projectName: '',
      goals: RichTextEditor.createEmptyValue(),
      readme: RichTextEditor.createEmptyValue(),
      tags: '',
      isPublic: false,
    };
    this.onProjectNameChange = e => this.setState({ projectName: e.target.value });
    this.onTagsChange = e => this.setState({ tags: e.target.value });
    this.onGoalsEditorChange = goals => this.setState({ goals });
    this.onReadmeEditorChange = readme => this.setState({ readme });
    this.onIsPublicChange = isPublic => this.setState({ isPublic });
    this.handleSubmit = e => {
      this.props.onSubmit({
        ...this.state,
        goals: this.state.goals.toString('html'),
        readme: this.state.readme.toString('html'),
      });
      e.preventDefault();
    };
  }

  render() {
    const toolbarConfig = {
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
      INLINE_STYLE_BUTTONS: [
        { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
        { label: 'Italic', style: 'ITALIC' },
        { label: 'Underline', style: 'UNDERLINE' },
      ],
      BLOCK_TYPE_DROPDOWN: [
        { label: 'Normal', style: 'unstyled' },
        { label: 'Heading Large', style: 'header-one' },
        { label: 'Heading Medium', style: 'header-two' },
        { label: 'Heading Small', style: 'header-three' },
      ],
      BLOCK_TYPE_BUTTONS: [
        { label: 'UL', style: 'unordered-list-item' },
        { label: 'OL', style: 'ordered-list-item' },
      ],
    };

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Create Project:</h3>
        <FormControl
          id="formControlsProjectName"
          type="text"
          label="ProjectName"
          placeholder="Project Name"
          value={this.state.projectName}
          onChange={this.onProjectNameChange}
        />
        <div style={{ marginBottom: 15 }}></div>

        <div>Goals</div>
        <RichTextEditor toolbarConfig={toolbarConfig} value={this.state.goals} onChange={this.onGoalsEditorChange} />
        <div style={{ marginBottom: 15 }}></div>

        <div>Readme (Optional)</div>
        <RichTextEditor toolbarConfig={toolbarConfig} value={this.state.readme} onChange={this.onReadmeEditorChange} />
        <div style={{ marginBottom: 15 }}></div>

        <FormControl
          id="formControlsTags"
          type="text"
          label="Tags"
          placeholder="Tags (Language, Libraries, etc)"
          value={this.state.tags}
          onChange={this.onTagsChange}
        />
        <div style={{ marginBottom: 15 }}></div>

        <FormGroup>
          <Radio checked={this.state.isPublic} onChange={() => this.onIsPublicChange(true)}>Public</Radio>
          <Radio checked={!this.state.isPublic} onChange={() => this.onIsPublicChange(false)}>Private</Radio>
        </FormGroup>

        <Button type="submit">Create Repository</Button>
      </form>
    );
  }
}

export default CreateProjectForm;
