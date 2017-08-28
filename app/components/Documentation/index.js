import React from 'react'
import Helmet from 'react-helmet'
import MainGrid from 'components/shared/MainGrid'
import Template from '../Template'


import CONFIG from './_config'
import PAGE_JSON from '../../../pages/_README.json'

export const Documentation = () => (
  <MainGrid>
    <Helmet title="Documentation" meta={[{ name: 'description', content: 'Description of Documentation' }]} />
    <Template
      stylesheets={CONFIG.stylesheets}
      bodyHtml={PAGE_JSON.bodyHtml}
    />
  </MainGrid>
  )

export default Documentation
