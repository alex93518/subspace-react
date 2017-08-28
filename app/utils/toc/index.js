/* globals define */
import zenscroll from 'zenscroll'
// import zenscroll from 'react-custom-scrollbars'
import BuildHtml from './build-html'
import defaultOptions from './default-options'
import ParseContent from './parse-content'

const tocbot = {}
module.exports = ((root, factory) => {
  if (typeof define === 'function' && define.amd) {
    define([], factory(root))
  } else if (typeof exports === 'object') {
    module.exports = factory(root)
  } else {
    root.tocbot = factory(root)
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, root => {
  // Default options.
  // Object to store current options.
  let options = {}
  // Object for public APIs.
  // Keep these variables at top scope once options are passed in.
  let buildHtml
  let parseContent

  // Just return if its not a browser.
  if (typeof window === 'undefined') {
    return
  }
  const supports = !!root.document.querySelector && !!root.addEventListener // Feature test
  let headingsArray

  // From: https://github.com/Raynos/xtend
  const hasOwnProperty = Object.prototype.hasOwnProperty
  function extend(...args) {
    const target = {}
    const source1 = Array.prototype.slice.call(args);
    for (let i = 0; i < source1.length; i += 1) {
      const source = source1[i];

      Object.keys(source).forEach(value => {
        if (hasOwnProperty.call(source, value)) {
          target[value] = source[value]
        }
      });
      // for (const key of source) {
      //   if (hasOwnProperty.call(source, key)) {
      //     target[key] = source[key]
      //   }
      // }
    }
    return target
  }
  // From: https://remysharp.com/2010/07/21/throttling-function-calls
  function throttle(fn, threshhold, scope) {
    if (!threshhold) threshhold = 250;
    let last
    let deferTimer
    return () => {
      const context = scope || this
      const now = +new Date()
      const args = fn;
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer)
        deferTimer = setTimeout(() => {
          last = now
          fn.apply(context, args)
        }, threshhold)
      } else {
        last = now
        fn.apply(context, args)
      }
    }
  }

  /**
   * Destroy tocbot.
   */
  tocbot.destroy = function () {
    // Clear HTML.
    try {
      document.querySelector(options.tocSelector).innerHTML = ''
    } catch (e) {
      console.warn('Element not found: ' + options.tocSelector); // eslint-disable-line
    }

    // Remove event listeners.
    document.removeEventListener('scroll', this.scrollListener, false)
    document.removeEventListener('resize', this.scrollListener, false)
    if (buildHtml) {
      document.removeEventListener('click', this.clickListener, false)
    }
  }

  /**
   * Initialize tocbot.
   * @param {object} customOptions
   */
  tocbot.init = function (customOptions) {
    // feature test
    if (!supports) {
      return
    }

    // Merge defaults with user options.
    // Set to options variable at the top.
    options = extend(defaultOptions, customOptions || {})
    this.options = options
    this.state = {}

    // Init smooth scroll if enabled (default).
    if (options.smoothScroll) {
      tocbot.zenscroll = zenscroll
      tocbot.zenscroll.setup(options.smoothScrollDuration)
    }

    // Pass options to these modules.
    buildHtml = BuildHtml(options)
    parseContent = ParseContent(options)

    // For testing purposes.
    this.buildHtml = buildHtml
    this.parseContent = parseContent

    // Destroy it if it exists first.
    tocbot.destroy()

    // Get headings array.
    headingsArray = parseContent.selectHeadings(options.contentSelector, options.headingSelector)
    // Return if no headings are found.
    if (headingsArray === null) {
      return
    }

    // Build nested headings array.
    const nestedHeadingsObj = parseContent.nestHeadingsArray(headingsArray)
    const nestedHeadings = nestedHeadingsObj.nest

    // Render.
    buildHtml.render(options.tocSelector, nestedHeadings)

    // Update Sidebar and bind listeners.
    this.scrollListener = throttle(e => {
      buildHtml.updateToc(headingsArray)
      const isTop = e && e.target && e.target.scrollingElement && e.target.scrollingElement.scrollTop === 0
      if ((e && e.eventPhase === 0) || isTop) {
        buildHtml.enableTocAnimation()
        buildHtml.updateToc(headingsArray)
        if (options.scrollEndCallback) {
          options.scrollEndCallback(e)
        }
      }
    }, options.throttleTimeout)
    this.scrollListener()
    document.addEventListener('scroll', this.scrollListener, false)
    document.addEventListener('resize', this.scrollListener, false)

    // Bind click listeners to disable animation.
    this.clickListener = throttle(event => {
      if (options.smoothScroll) {
        buildHtml.disableTocAnimation(event)
      }
      buildHtml.updateToc(headingsArray)
    }, options.throttleTimeout)
    document.addEventListener('click', this.clickListener, false)
  }

  /**
   * Refresh tocbot.
   */

  tocbot.refresh = function (customOptions) {
    tocbot.destroy()
    tocbot.init(customOptions || this.options)
  }

  // Make tocbot available globally.
  root.tocbot = tocbot;
})

module.exports = tocbot
