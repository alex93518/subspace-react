import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form/immutable';
import { ReduxFormInput } from 'components/shared/ReduxFormInput';

const EmailSignupForm = ({ handleSubmit, onSubmit }) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Field name="username" component={ReduxFormInput} type="text" placeholder="user name" />
    <Field name="email" component={ReduxFormInput} type="email" placeholder="email address" />
    <Field name="password" component={ReduxFormInput} type="password" placeholder="password" />
    <Field name="verifyPassword" component={ReduxFormInput} type="password" placeholder="verify password" />
    <Button type="submit">
      Sign Up
    </Button>
  </form>
)

EmailSignupForm.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default reduxForm({
  form: 'signup',
})(EmailSignupForm);
