import React, { PropTypes } from 'react';
import { Grid, Row, Col, FormControl, Button } from 'react-bootstrap';

class LoginStep extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    username: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e) {
    this.setState({ username: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state.username, this.state.password);
  }

  render() {
    const { username } = this.props;
    return (
      <Grid>
        <Row>
          <Col md={4} mdOffset={4} className="text-center">
            <h5>First time user</h5>
            <h3>Welcome, {username}</h3>
            <h3>One more step to go</h3>
            <form onSubmit={this.handleSubmit}>
              Choose your terrella username:
              <FormControl
                id="formControlsUsername"
                type="text"
                label="Username"
                placeholder="Enter username"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
              Choose your terrella git password:
              <FormControl
                id="formControlsPassword"
                label="Password"
                type="password"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
              />
              <div>(Choose Interests)</div>
              <Button type="submit">
                Submit
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>);
  }
}

export default LoginStep;
