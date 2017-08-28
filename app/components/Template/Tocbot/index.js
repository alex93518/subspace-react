import React from 'react'
import toc from '../../../utils/toc/index'

const TOCBOT_OPTIONS = {
  tocSelector: '.js-toc',
  contentSelector: '.js-toc-content',
  headingSelector: 'h1, h2, h3, h4',
  positionFixedSelector: '.js-toc',
  smoothScrollOptions: {
    easing: 'easeInOutCubic',
    offset: 0,
    speed: 300,
  },
}

// Only require tocbot if in browser.
const tocbot = (typeof window !== 'undefined')
  ? toc : null

export default class Tocbot extends React.Component {
  componentDidMount() {
    if (tocbot) {
      tocbot.init(TOCBOT_OPTIONS)
    }
  }

  componentWillUnmount() {
    if (tocbot) {
      tocbot.destroy()
    }
  }

  render() {
    return null
  }
}
