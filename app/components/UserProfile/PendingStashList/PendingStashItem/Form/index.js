import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import Paper from 'material-ui/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import { TextField } from '@gfpacheco/redux-form-material-ui';
import { updateStashMetaMutation } from 'relay';
import styled from 'styled-components';

const MainForm = styled.form`
  padding: 0 20px;
  padding-bottom: 5px;
  background: #fff;
`

const Form = ({ handleSubmit }) => (
  <Paper elevation={1}>
    <MainForm onSubmit={handleSubmit}>
      <Field
        name="stashTitle"
        component={TextField}
        fullWidth
        label="Add title"
      />
      <Field
        name="stashDescription"
        component={TextField}
        fullWidth
        multiline
        label="Add description"
      />
    </MainForm>
  </Paper>
);

Form.propTypes = {
  handleSubmit: PropTypes.func,
}

export default compose(
  withHandlers({
    onSubmit: props => formValue => {
      updateStashMetaMutation({
        stashId: props.stashId,
        title: formValue.get('stashTitle') || null,
        description: formValue.get('stashDescription') || null,
      })
    },
  }),
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
  })
)(Form)
