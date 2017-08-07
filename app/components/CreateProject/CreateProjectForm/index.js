import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Button, FormGroup } from 'react-bootstrap'
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';
import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';
import { makeSelectAuth } from 'redux/selectors'
import { injectSelectors } from 'redux/utils'
import { TextInput } from 'components/shared/form'
import Separator from 'components/shared/Separator';
import { withRouter } from 'react-router-dom';
import { LinkUserPhoto } from 'components/shared/Links';
import {
  SpanSeparator, Dt, UserName, DivOptHead, SpanOpt,
  FloatDiv, AccessDesc, DlNoMargin, RadioField,
  VotePush, StandardPush, RepoPublic, RepoPrivate,
} from './styles'

const CreateProjectForm = ({ handleSubmit, auth, change, createProject }) => (
  <form onSubmit={handleSubmit}>
    <h3>Create a new project</h3>
    <div>This will create a repository contains all the files for your project, including the revision history.</div>
    <hr />
    <table>
      <thead>
        <tr>
          <th><strong>Owner</strong></th>
          <th />
          <th><strong>Project name</strong></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <LinkUserPhoto
              width={28}
              height={28}
              user={{
                userName: auth.userName,
                photoUrl: auth.user.photoUrl,
              }}
            /><UserName userName={auth.userName} />
          </td>
          <td><SpanSeparator>/</SpanSeparator></td>
          <td>
            <Field
              name="name"
              component={TextInput}
              type="text"
              width="300px"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <Separator />
    <FormGroup>
      <DivOptHead className="clearfix">
        <FloatDiv>
          <RadioField
            name="repoAccess"
            component="input"
            type="radio"
            value="public"
          />
          <RepoPublic
            width={30}
            height={30}
            data-repoAccess={createProject.repoAccess}
            onClick={() => change('repoAccess', 'public')}
          />
        </FloatDiv>
        <AccessDesc onClick={() => change('repoAccess', 'public')}>
          <DlNoMargin>
            <dt>Public</dt>
            <dd>Anyone can see this repository.</dd>
          </DlNoMargin>
        </AccessDesc>
      </DivOptHead>
      <div className="clearfix">
        <FloatDiv>
          <RadioField
            name="repoAccess"
            component="input"
            type="radio"
            value="private"
          />
          <RepoPrivate
            width={30}
            height={30}
            data-repoAccess={createProject.repoAccess}
            onClick={() => change('repoAccess', 'private')}
          />
        </FloatDiv>
        <AccessDesc onClick={() => change('repoAccess', 'private')}>
          <DlNoMargin>
            <dt>Private</dt>
            <dd>You choose who can see and commit to this repository.</dd>
          </DlNoMargin>
        </AccessDesc>
      </div>
    </FormGroup>
    <Separator />
    <FormGroup>
      <DivOptHead className="clearfix">
        <FloatDiv>
          <RadioField
            name="repoPushVote"
            component="input"
            type="radio"
            value="pushVote"
          />
          <VotePush
            width={30}
            height={30}
            data-repoPushVote={createProject.repoPushVote}
            onClick={() => change('repoPushVote', 'pushVote')}
          />
        </FloatDiv>
        <AccessDesc onClick={() => change('repoPushVote', 'pushVote')}>
          <DlNoMargin>
            <dt>Vote Pushes</dt>
            <dd>
              <div>
                Pushes should meet certain vote threshold before added to the repository.
              </div>
              <div>
                <RadioField
                  name="isReviewStash"
                  id="isReviewStash"
                  component="input"
                  type="checkbox"
                />
                <span
                  onClick={() => change('isReviewStash', !createProject.isReviewStash)}
                  role="button"
                  tabIndex="0"
                >
                  Review pushes
                </span>
              </div>
            </dd>
          </DlNoMargin>
        </AccessDesc>
      </DivOptHead>
      <div className="clearfix">
        <FloatDiv>
          <RadioField
            name="repoPushVote"
            component="input"
            type="radio"
            value="standard"
          />
          <StandardPush
            width={30}
            height={30}
            data-repoPushVote={createProject.repoPushVote}
            onClick={() => change('repoPushVote', 'standard')}
          />
        </FloatDiv>
        <AccessDesc onClick={() => change('repoPushVote', 'standard')}>
          <DlNoMargin>
            <dt>Standard Pushes</dt>
            <dd>Use standard git push feature.</dd>
          </DlNoMargin>
        </AccessDesc>
      </div>
    </FormGroup>
    <Separator />
    <div>
      <DivOptHead>
        Help people to understand your project better by providing a description, goals or topics. <SpanOpt>(Optional)</SpanOpt>
      </DivOptHead>
    </div>
    <div>
      <Dt>Description</Dt>
      <dd>
        <Field name="description" component={TextInput} type="text" />
      </dd>
    </div>
    <div>
      <Dt>Topics</Dt>
      <dd>
        <Field
          name="topics"
          component={TextInput}
          type="text"
        />
      </dd>
    </div>
    <div>
      <Dt>Goals</Dt>
      <dd>
        <Field
          name="goals"
          component={TextInput}
          type="text"
        />
      </dd>
    </div>
    <Separator />
    <Button type="submit">Create Project</Button>
  </form>
)

CreateProjectForm.propTypes = {
  handleSubmit: PropTypes.func,
  auth: PropTypes.object,
  change: PropTypes.func,
  createProject: PropTypes.object,
}

export default compose(
  withRouter,
  injectSelectors({
    auth: makeSelectAuth(),
  }),
  reduxForm({
    form: 'createProject',
    initialValues: {
      repoAccess: 'public',
      repoPushVote: 'pushVote',
      isReviewStash: true,
    },
    enableReinitialize: true,
    onSubmit: async (values, _, { auth, history }) => {
      const { repoAccess, repoPushVote, isReviewStash, topics, ...repository } = values;
      if (!repository.name) {
        throw new SubmissionError({ name: 'Project name cannot be empty', _error: 'Empty project name' })
      }

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
        isReviewStash,
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
  connect(state => ({
    createProject: state.get('form').createProject.values,
  }))
)(CreateProjectForm);
