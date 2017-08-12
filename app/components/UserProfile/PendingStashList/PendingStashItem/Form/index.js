import React from 'react';
import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import { Field, reduxForm } from 'redux-form/immutable';
import { TextField } from 'redux-form-material-ui';
import { updateStashMetaMutation } from 'relay';
import styled from 'styled-components';

const TextInput = styled(TextField)`
  margin-top: 0px !important;
`

const MainForm = styled.form`
  padding: 0 20px;
  padding-bottom: 5px;
  background: #fff;
`

const styles = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
}

const Form = ({ handleSubmit }) => (
  <Paper zDepth={1}>
    <MainForm onSubmit={handleSubmit}>
      <Field
        name="stashTitle"
        component={TextInput}
        fullWidth
        hintText="Add title"
        hintStyle={styles}
        underlineShow={false}
      />
      <Divider />
      <Field
        name="stashDescription"
        component={TextInput}
        fullWidth
        multiLine
        hintText="Add description"
        hintStyle={styles}
        underlineShow={false}
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
