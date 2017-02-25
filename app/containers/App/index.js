import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
import Relay from 'react-relay';
import { authActions } from '../App/actions';
import makeSelectAuth from '../App/selectors';
import Header from '../../components/shared/Header';

class App extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    children: PropTypes.node,
    auth: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    const { authenticated } = this.props.auth;
    const { signOut } = this.props.actions;
    const displayName = authenticated ? this.props.auth.user.authUser.displayName : null;
    return (
      <div>
        <Header authenticated={authenticated} displayName={displayName} signOut={signOut} />
        <Grid>
          {React.Children.toArray(this.props.children)}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(authActions, dispatch) };
}

const AppRedux = connect(mapStateToProps, mapDispatchToProps)(App);

export default Relay.createContainer(
  AppRedux,
  {
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          id
        }
      `,
    },
  }
);
