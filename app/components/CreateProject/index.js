import React from 'react'
import Helmet from 'react-helmet'
import MainGrid from 'components/shared/MainGrid'
import CreateProjectForm from './CreateProjectForm'

export const CreateProject = () => (
  <MainGrid>
    <Helmet
      title="CreateProject"
      meta={[{
        name: 'description',
        content: 'Description of CreateProject',
      }]}
    />
    <CreateProjectForm />
  </MainGrid>
)

export default CreateProject
