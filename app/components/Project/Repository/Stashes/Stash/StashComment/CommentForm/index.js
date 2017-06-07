import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form/immutable';
import { TextArea } from 'components/shared/form';

const CommentForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Field
      name="addComment"
      component={TextArea}
      rows="4"
      placeholder="Comment"
    />
    <Button type="submit">
      Add Comment
    </Button>
  </form>
)

CommentForm.propTypes = {
  handleSubmit: PropTypes.func,
}

export default reduxForm({
  form: 'stashComment',
})(CommentForm);
