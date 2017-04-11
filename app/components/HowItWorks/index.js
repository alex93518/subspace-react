import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import MainGrid from 'components/shared/MainGrid';

export class HowItWorks extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <MainGrid>
        <Helmet
          title="HowItWorks"
          meta={[{ name: 'description', content: 'Description of HowItWorks' }]}
        />
        <h1>How it works</h1>
      </MainGrid>
    );
  }
}

HowItWorks.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(HowItWorks);
