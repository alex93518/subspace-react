import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import HomePage from 'components/HomePage';
import About from 'components/About';
import HowItWorks from 'components/HowItWorks';
import Projects from 'components/Projects';
import Project from 'components/Project';
import Login from 'components/Login';
import UserProfile from 'components/UserProfile';
import CreateProject from 'components/CreateProject';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { matchName } from 'utils/routeMatcher';
import { history } from './store';

const Router = () =>
  (
    <ConnectedRouter history={history}>
      <div>
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
      </div>
    </ConnectedRouter>
  );

export default Router;
