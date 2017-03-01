import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import CreateProjectMutation from 'relay/mutations/CreateProjectMutation';
import CreateProjectForm from 'components/projects/CreateProjectForm';
import CurrentRelay from 'relay';

export class CreateProject extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    auth: PropTypes.object,
  };

  handleSubmit(payload, userId) {
    CurrentRelay.Store.commitUpdate(
      new CreateProjectMutation({ ...payload, userId }),
      {
        onSuccess: () => alert('Project created'),
        onFailure: transaction => console.log(transaction.getError()),
      }
    );
  }

  render() {
    return (
      <div>
        <Helmet
          title="CreateProject"
          meta={[{ name: 'description', content: 'Description of CreateProject' }]}
        />
        <CreateProjectForm
          onSubmit={payload => this.handleSubmit(payload, this.props.auth.user.user.uid)}
        />
      </div>
    );
  }
}

export default CreateProject;
