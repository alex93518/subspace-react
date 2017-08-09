import React from 'react';
// import PropTypes from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { orange500 } from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Field, reduxForm } from 'redux-form/immutable';
import { TextField } from 'redux-form-material-ui';
import { updateStashMetaMutation } from 'relay';
import styled from 'styled-components';

injectTapEventPlugin();

const TextInput = styled(TextField)`
  margin-top: 0px !important;
`

const styles = {
  color: orange500,
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
}

const Form = () => (
  <MuiThemeProvider>
    <form onSubmit={() => {}}>
      <div>
        <Field
          name="stashTitle"
          component={TextInput}
          fullWidth
          hintText="Add title"
          hintStyle={styles}
        />
      </div>
      <div>
        <Field
          name="stashDescription"
          component={TextInput}
          fullWidth
          multiLine
          hintText="Add description"
          hintStyle={styles}
        />
      </div>
    </form>
  </MuiThemeProvider>
);

Form.propTypes = {
  // handleSubmit: PropTypes.func,
  // onSubmit: PropTypes.func,
  // pristine: PropTypes.bool,
  // reset: PropTypes.func,
  // submitting: PropTypes.bool,
}

export default compose(
  connect((state, props) => ({
    form: `stashForm${props.formId}`,
  })),
  withHandlers({
    onSubmit: props => formValue => {
      updateStashMetaMutation({
        stashId: props.stashId,
        title: formValue.stashTitle || null,
        description: formValue.stashDescription || null,
      })
    },
  }),
  reduxForm({
    destroyOnUnmount: false,
  })
)(Form)
