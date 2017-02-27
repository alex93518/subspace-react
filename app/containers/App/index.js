import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'react-bootstrap';
import { createStructuredSelector } from 'reselect';
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
    const { authenticated, user } = this.props.auth;
    const { signOut } = this.props.actions;
    const displayName = authenticated ? this.props.auth.user.user.displayName : null;
    const userName = user ? this.props.auth.user.userName : null;
    return (
      <div>
        <Header authenticated={authenticated} displayName={displayName} userName={userName} signOut={signOut} />
        <Grid>
          {React.cloneElement(this.props.children, { auth: this.props.auth, authActions: this.props.actions })}
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
