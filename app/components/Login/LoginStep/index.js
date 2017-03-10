import React, { PropTypes } from 'react';
import { Grid, Row, Col, Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form/immutable';
import { TextInput } from 'components/shared/form';

const LoginStep = ({ handleSubmit, username }) => (
  <Grid>
    <Row>
      <Col md={4} mdOffset={4} className="text-center">
        <h5>First time user</h5>
        <h3>Welcome, {username}</h3>
        <h3>One more step to go</h3>
        <form onSubmit={handleSubmit}>
          Choose your terrella username:
          <Field
            name="userName"
            component={TextInput}
            type="text"
            placeholder="Enter username"
          />
          Choose your terrella git password:
          <Field
            name="password"
            component={TextInput}
            type="password"
            placeholder="Enter password"
          />
          <Button type="submit">
            Submit
          </Button>
        </form>
      </Col>
    </Row>
  </Grid>
)

LoginStep.propTypes = {
  handleSubmit: PropTypes.func,
  username: PropTypes.string,
}

export default reduxForm({
  form: 'loginstep',
})(LoginStep);
