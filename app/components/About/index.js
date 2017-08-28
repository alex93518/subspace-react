import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import MainGrid from 'components/shared/MainGrid';

export class About extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <MainGrid>
        <Helmet title="About" meta={[{ name: 'description', content: 'Description of About' }]} />
        <h1>About</h1>
      </MainGrid>
    );
  }
}

About.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(About);
