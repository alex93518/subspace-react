import React from 'react'
import PropTypes from 'prop-types'
import Tocbot from './Tocbot'

function Template(props) {
  return (
    <div className="page-content">

      {props.stylesheets && props.stylesheets.length > 0 && props.stylesheets.map((stylesheet, i) => <link key={stylesheet.concat(i)} rel="stylesheet" href={stylesheet} />)}
      <main>
        <div className="mw12 center dark-gray lh-copy">
          <nav className="toc toc-left js-toc relative z-1 transition--300 absolute pa4" />
          <div
            className="content js-toc-content pa5"
            dangerouslySetInnerHTML={{ __html: props.bodyHtml }}
          />
        </div>
        <Tocbot />
      </main>
    </div>
  )
}

Template.defaultProps = {
  description: '',
  stylesheets: [
    'https://unpkg.com/tachyons@4.7.0/css/tachyons.min.css',
  ],

}

Template.propTypes = {
  stylesheets: PropTypes.array,
  bodyHtml: PropTypes.string.isRequired,
}

export default Template
