import React from 'react';
import Helmet from 'react-helmet';
import CreateProjectForm from '../../components/projects/CreateProjectForm';

export class CreateProject extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="CreateProject"
          meta={[{ name: 'description', content: 'Description of CreateProject' }]}
        />
        <CreateProjectForm onSubmit={(payload) => console.log(payload)} />
      </div>
    );
  }
}

export default CreateProject;
