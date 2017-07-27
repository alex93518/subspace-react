import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { matchName } from 'utils/routeMatcher';
import asyncComponent from 'utils/asyncComponent';
import styled from 'styled-components';
import { history } from './store';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
`

const HomePage = asyncComponent(() => import('components/HomePage'));
const About = asyncComponent(() => import('components/About'));
const HowItWorks = asyncComponent(() => import('components/HowItWorks'));
const Projects = asyncComponent(() => import('components/Projects'));
const Project = asyncComponent(() => import('components/Project'));
const Login = asyncComponent(() => import('components/Login'));
const UserProfile = asyncComponent(() => import('components/UserProfile'));
const CreateProject = asyncComponent(() => import('components/CreateProject'));
const Header = asyncComponent(() => import('components/layout/Header'));
const Footer = asyncComponent(() => import('components/layout/Footer'));

const Router = () =>
  (
    <ConnectedRouter history={history}>
      <FlexContainer>
        <Header />
        <Switch>
          <Route exact path={'/'} render={() => <HomePage />} />
          <Route exact path="/about" render={() => <About />} />
          <Route exact path="/howitworks" render={() => <HowItWorks />} />
          <Route exact path="/projects" render={() => <Projects />} />
          <Route exact path={'/login'} render={() => <Login />} />
          <Route exact path={'/profile/:userName'} render={props => <UserProfile {...props} />} />
          <Route exact path={'/createproject'} render={() => <CreateProject />} />
          <Route
            path={'/:userName/:projectName'}
            render={() =>
              <Project childName={matchName(history.location.pathname)} />
            }
          />
        </Switch>
        <Footer />
      </FlexContainer>
    </ConnectedRouter>
  );

export default Router;
