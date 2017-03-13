import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

export class HowItWorks extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="HowItWorks"
          meta={[{ name: 'description', content: 'Description of HowItWorks' }]}
        />
        <h1>How it works</h1>
      </div>
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
