import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import Relay from 'react-relay';
import CreateProjectMutation from '../../relay/mutations/CreateProjectMutation';
import CreateProjectForm from '../../components/projects/CreateProjectForm';

export class CreateProject extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    auth: PropTypes.object,
  };

  handleSubmit(payload, userId) {
    const onSuccess = () => {
      alert('Project created');
    };

    const onFailure = (transaction) => {
      console.log(transaction.getError());
    };

    Relay.Store.commitUpdate(new CreateProjectMutation({ ...payload, userId }), { onFailure, onSuccess });
  }

  render() {
    return (
      <div>
        <Helmet
          title="CreateProject"
          meta={[{ name: 'description', content: 'Description of CreateProject' }]}
        />
        <CreateProjectForm
          onSubmit={(payload) => this.handleSubmit(payload, this.props.auth.user.user.uid)}
        />
      </div>
    );
  }
}

export default CreateProject;
