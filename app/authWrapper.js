import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, lifecycle } from 'recompose';
import { firebaseAuth } from 'utils/firebase';
import Router from './router'

const AuthWrapper = ({ isUserLoaded }) => (
  <div>
    {isUserLoaded ? <Router /> : null}
  </div>
)

AuthWrapper.propTypes = {
  isUserLoaded: PropTypes.bool.isRequired,
}

export default compose(
  withState('isUserLoaded', 'updateIsUserLoaded', false),
  lifecycle({
    componentWillMount() {
      firebaseAuth.onAuthStateChanged(
        () => {
          this.props.updateIsUserLoaded(true);
        }
      )
    },
  })
)(AuthWrapper);
