import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { redirect } from 'redux/utils'
import CurrentRelay, { CreateProjectMutation } from 'relay';
import CreateProjectForm from './CreateProjectForm';

export class CreateProject extends Component {
  static propTypes = {
    auth: PropTypes.object,
  };

  // eslint-disable-next-line
  handleSubmit = ({ repoAccess, repoPushVote, topics, ...repository }) => {
    CurrentRelay.Store.commitUpdate(
      new CreateProjectMutation({
        repository: {
          ...repository,
          isPushVote: repoPushVote !== 'standard',
          isPrivate: repoAccess === 'private',
          ownerId: this.props.auth.user.uid,
          topics: topics ? topics.split(' ') : undefined, // TODO: add array input field to project form
        },
      }),
      {
        onSuccess: () => redirect('/projects'),
        onFailure: transaction => console.log(transaction.getError()),
      }
    )
  }

  render() {
    return (
      <div>
        <Helmet
          title="CreateProject"
          meta={[{
            name: 'description',
            content: 'Description of CreateProject',
          }]}
        />
        <CreateProjectForm onSubmit={this.handleSubmit} />
      </div>
    )
  }
}

export default CreateProject
