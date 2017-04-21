import React, { PropTypes } from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';

const App = ({ children }) => (
  <div>
    <Header />
    {children}
    <Footer />
  </div>
)

App.propTypes = {
  children: PropTypes.node,
}

export default App
