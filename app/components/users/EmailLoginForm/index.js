import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form/immutable';
import { ReduxFormInput } from 'components/shared/ReduxFormInput';

const EmailLoginForm = ({ handleSubmit, onSubmit }) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Field name="email" component={ReduxFormInput} type="email" placeholder="Email Address" />
    <Field name="password" component={ReduxFormInput} type="password" placeholder="Password" />
    <Button type="submit">
      Sign Up
    </Button>
  </form>
)

EmailLoginForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default reduxForm({
  form: 'login',
})(EmailLoginForm);
