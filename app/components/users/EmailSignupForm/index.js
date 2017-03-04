import React, { PropTypes } from 'react';
import { FormControl, Button } from 'react-bootstrap';

class EmailSignupForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      verifyPassword: '',
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleVerifyPasswordChange = this.handleVerifyPasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleVerifyPasswordChange(e) {
    this.setState({ verifyPassword: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.password === this.state.verifyPassword) {
      this.props.onSubmit({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      });
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormControl
          id="formControlsUsername"
          type="text"
          label="Username"
          placeholder="Enter username"
          value={this.state.username}
          onChange={this.handleUsernameChange}
        />
        <div style={{ height: 5 }}></div>
        <FormControl
          id="formControlsEmail"
          type="email"
          label="Email address"
          placeholder="Enter email"
          value={this.state.email}
          onChange={this.handleEmailChange}
        />
        <div style={{ height: 5 }}></div>
        <FormControl
          id="formControlsPassword"
          label="Password"
          type="password"
          placeholder="Enter password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
        />
        <div style={{ height: 5 }}></div>
        <FormControl
          id="formControlsVerifyPassword"
          label="VerifyPassword"
          type="password"
          placeholder="Verify password"
          value={this.state.verifyPassword}
          onChange={this.handleVerifyPasswordChange}
        />
        <div style={{ height: 5 }}></div>
        <Button type="submit">
          Sign Up
        </Button>
      </form>
    );
  }
}

export default EmailSignupForm;
