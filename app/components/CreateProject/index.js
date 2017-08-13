import React from 'react';
import Helmet from 'react-helmet';
import MainGrid from 'components/shared/MainGrid';
import { FormWidth } from './styles';
import CreateProjectForm from './CreateProjectForm';

export const CreateProject = () => (
  <MainGrid>
    <FormWidth>
      <Helmet
        title="CreateProject"
        meta={[{
          name: 'description',
          content: 'Description of CreateProject',
        }]}
      />
      <CreateProjectForm
        initialValues={{
          repoAccess: 'public',
          repoPushVote: 'pushVote',
          isReviewStash: true,
        }}
      />
    </FormWidth>
  </MainGrid>
)

export default CreateProject
