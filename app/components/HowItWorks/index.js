import React from 'react'
import Helmet from 'react-helmet'
import MainGrid from 'components/shared/MainGrid'

export const HowItWorks = () => (
  <MainGrid>
    <Helmet
      title="HowItWorks"
      meta={[{ name: 'description', content: 'Description of HowItWorks' }]}
    />
    <h1>How it works</h1>
  </MainGrid>
)

export default HowItWorks
