import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form/immutable';
import { authActions } from 'redux/auth/actions'
import { TextInput } from 'components/shared/form';

const EmailSignupForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="userName"
      component={TextInput}
      type="text"
      placeholder="user name"
    />
    <Field
      name="email"
      component={TextInput}
      type="email"
      placeholder="email address"
    />
    <Field
      name="password"
      component={TextInput}
      type="password"
      placeholder="password"
    />
    <Field
      name="verifyPassword"
      component={TextInput}
      type="password"
      placeholder="verify password"
    />
    <Button type="submit">
      Sign Up
    </Button>
  </form>
)

EmailSignupForm.propTypes = {
  handleSubmit: PropTypes.func,
}

export default reduxForm({
  form: 'signup',
  onSubmit: authActions.createUserWithEmailPassword.init,
})(EmailSignupForm);
