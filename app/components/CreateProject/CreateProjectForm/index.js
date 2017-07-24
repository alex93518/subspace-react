import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose'
import { Button, FormGroup } from 'react-bootstrap'
import { Field, reduxForm } from 'redux-form/immutable';
import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';
import { makeSelectAuth } from 'redux/selectors'
import { injectSelectors } from 'redux/utils'
import { TextInput, TextArea } from 'components/shared/form'
import { withRouter } from 'react-router-dom';

const CreateProjectForm = ({ handleSubmit, error }) => (
  <form onSubmit={handleSubmit}>
    <h3>Create Project:</h3>
    <div>
      {error && <strong>{error}</strong>}
      <hr />
    </div>
    <Field
      name="name"
      component={TextInput}
      type="text"
      placeholder="Project Name"
    />
    <div>Goals</div>
    <Field name="goals" component={TextArea} rows="5" />
    <div>Description</div>
    <Field name="description" component={TextArea} rows="5" />
    <Field
      name="topics"
      component={TextInput}
      type="text"
      placeholder="Topics"
    />
    <FormGroup>
      <Field
        name="repoAccess"
        component="input"
        type="radio"
        value="public"
      /> Public
      <div></div>
      <Field
        name="repoAccess"
        component="input"
        type="radio"
        value="private"
      /> Private
    </FormGroup>
    <FormGroup>
      <Field
        name="repoPushVote"
        component="input"
        type="radio"
        value="pushVote"
      /> Vote For Push
      <div></div>
      <Field
        name="repoPushVote"
        component="input"
        type="radio"
        value="standard"
      /> Standard
    </FormGroup>
    <Button type="submit">Create Repository</Button>
  </form>
)

CreateProjectForm.propTypes = {
  handleSubmit: PropTypes.func,
  error: PropTypes.string,
}

export default compose(
  withRouter,
  injectSelectors({
    auth: makeSelectAuth(),
  }),
  reduxForm({
    form: 'createProject',
    onSubmit: async (values, _, { auth, history }) => {
      const { repoAccess, repoPushVote, topics, ...repository } = values;
      const mutation = graphql`
        mutation CreateProjectFormMutation($input: CreateRepositoryInput!) {
          createRepository(input: $input) {
            clientMutationId
          }
        }
      `;

      const input = {
        ...repository,
        isPushVote: repoPushVote !== 'standard',
        isPrivate: repoAccess === 'private',
        ownerUserName: auth.userName,

        // TODO: add array input field to project form
        topics: topics ? topics.split(' ') : undefined,
      };
      commitMutation(
        env,
        {
          mutation,
          variables: { input },
          onCompleted: () => history.push(`/${auth.userName}/${repository.name}`),
          onError: err => console.error(err),
        },
      );
    },
  }),
)(CreateProjectForm);
