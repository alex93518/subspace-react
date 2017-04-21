import React from 'react';
import Helmet from 'react-helmet';
import MainGrid from 'components/shared/MainGrid';
import LoginWidget from './LoginWidget';

export const Login = () => (
  <MainGrid>
    <Helmet
      title="Login"
      meta={[{
        name: 'description',
        content: 'Description of Login',
      }]}
    />
    <LoginWidget />
  </MainGrid>
)

export default Login
