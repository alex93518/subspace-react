import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form/immutable';
import { authActions } from 'containers/App/actions'
import { ReduxFormInput } from 'components/shared/ReduxFormInput';

const EmailSignupForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="userName"
      component={ReduxFormInput}
      type="text"
      placeholder="user name"
    />
    <Field
      name="email"
      component={ReduxFormInput}
      type="email"
      placeholder="email address"
    />
    <Field
      name="password"
      component={ReduxFormInput}
      type="password"
      placeholder="password"
    />
    <Field
      name="verifyPassword"
      component={ReduxFormInput}
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
