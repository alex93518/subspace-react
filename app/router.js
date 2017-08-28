import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { matchName } from 'utils/routeMatcher';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import asyncComponent from 'utils/asyncComponent';
import styled from 'styled-components';
// import { Scrollbars } from 'components/shared/Scrollbars';
import { history } from './store';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const HomePage = asyncComponent(() => import('components/HomePage'));
const About = asyncComponent(() => import('components/About'));
const HowItWorks = asyncComponent(() => import('components/HowItWorks'));
const Documentation = asyncComponent(() => import('components/Documentation'));
const Projects = asyncComponent(() => import('components/Projects'));
const Project = asyncComponent(() => import('components/Project'));
const Login = asyncComponent(() => import('components/Login'));
const UserProfile = asyncComponent(() => import('components/UserProfile'));
const CreateProject = asyncComponent(() => import('components/CreateProject'));

const Router = () =>
  (
    <ConnectedRouter history={history}>
      {/* <Scrollbars
        autoHeight
        autoHeightMin={'100vh'}
        renderThumbVertical={({ style, ...props }) => (
          <div
            style={{
              ...style,
              backgroundColor: '#000',
              width: 20,
              opacity: 0.2,
              borderRadius: 6,
              zIndex: 99,
            }}
            {...props}
          />
        )}
      > */}
      <FlexContainer>
        <Header />
        <Switch>
          <Route exact path={'/'} render={() => <HomePage />} />
          <Route exact path="/about" render={() => <About />} />
          <Route exact path="/howitworks" render={() => <HowItWorks />} />
          <Route exact path="/documentation" render={() => <Documentation />} />
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
      {/* </Scrollbars> */}
    </ConnectedRouter>
  );

export default Router;
