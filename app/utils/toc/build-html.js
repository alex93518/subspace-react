/**
 * This file is responsible for building the DOM and updating DOM state.
 *
 * @author Tim Scanlin
 */

module.exports = function (options) {
  const forEach = [].forEach
  const some = [].some
  const body = document.body
  let currentlyHighlighting = true
  const SPACE_CHAR = ' '

  /**
   * Create link and list elements.
   * @param {Object} d
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  function createEl(d, container) {
    const link = container.appendChild(createLink(d))
    if (d.children.length) {
      const list = createList(d.isCollapsed)
      d.children.forEach(child => {
        createEl(child, list)
      })
      link.appendChild(list)
    }
  }

  /**
   * Render nested heading array data into a given selector.
   * @param {String} selector
   * @param {Array} data
   * @return {HTMLElement}
   */
  function render(selector, data) {
    const collapsed = false
    const container = createList(collapsed)

    data.forEach(d => {
      createEl(d, container)
    })

    const parent = document.querySelector(selector)

    // Return if no parent is found.
    if (parent === null) {
      return false
    }
    if (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
    return parent.appendChild(container)
  }

  /**
   * Create link element.
   * @param {Object} data
   * @return {HTMLElement}
   */
  function createLink(data) {
    const item = document.createElement('li')
    const a = document.createElement('a')
    if (options.listItemClass) {
      item.setAttribute('class', options.listItemClass)
    }
    if (options.includeHtml && data.childNodes.length) {
      forEach.call(data.childNodes, node => {
        a.appendChild(node.cloneNode(true))
      })
    } else {
      // Default behavior.
      a.textContent = data.textContent
    }
    a.setAttribute('href', `#${data.id}`)
    a.setAttribute('class', `${options.linkClass +
      SPACE_CHAR}node-name--${data.nodeName
      }${SPACE_CHAR}${options.extraLinkClasses}`)
    item.appendChild(a)
    return item
  }

  /**
   * Create list element.
   * @param {Boolean} isCollapsed
   * @return {HTMLElement}
   */
  function createList(isCollapsed) {
    const list = document.createElement('ul')
    let classes = options.listClass +
      SPACE_CHAR + options.extraListClasses
    if (isCollapsed) {
      classes += SPACE_CHAR + options.collapsibleClass
      classes += SPACE_CHAR + options.isCollapsedClass
    }
    list.setAttribute('class', classes)
    return list
  }

  /**
   * Update fixed sidebar class.
   * @return {HTMLElement}
   */
  function updateFixedSidebarClass() {
    const top = document.documentElement.scrollTop || body.scrollTop
    const posFixedEl = document.querySelector(options.positionFixedSelector)

    if (options.fixedSidebarOffset === 'auto') {
      options.fixedSidebarOffset = document.querySelector(options.tocSelector).offsetTop
    }

    if (top > options.fixedSidebarOffset) {
      if (posFixedEl.className.indexOf(options.positionFixedClass) === -1) {
        posFixedEl.className += SPACE_CHAR + options.positionFixedClass
      }
    } else {
      posFixedEl.className = posFixedEl.className.split(SPACE_CHAR + options.positionFixedClass).join('')
    }
  }

  /**
   * Update TOC highlighting and collpased groupings.
   */
  function updateToc(headingsArray) {
    const top = document.documentElement.scrollTop || body.scrollTop

    // Add fixed class at offset;
    if (options.positionFixedSelector) {
      updateFixedSidebarClass()
    }

    // Get the top most heading currently visible on the page so we know what to highlight.
    const headings = headingsArray
    let topHeader
    // Using some instead of each so that we can escape early.
    if (currentlyHighlighting &&
      document.querySelector(options.tocSelector) !== null &&
      headings.length > 0) {
      some.call(headings, (heading, i) => {
        if (heading.offsetTop > top + options.headingsOffset + 10) {
          // Don't allow negative index value.
          const index = (i === 0) ? i : i - 1
          topHeader = headings[index]
          return true
        } else if (i === headings.length - 1) {
          // This allows scrolling for the last heading on the page.
          topHeader = headings[headings.length - 1]
          return true
        }
        return false
      })

      // Remove the active class from the other tocLinks.
      const tocLinks = document.querySelector(options.tocSelector)
        .querySelectorAll(`.${options.linkClass}`)
      forEach.call(tocLinks, tocLink => {
        tocLink.className = tocLink.className.split(SPACE_CHAR + options.activeLinkClass).join('')
      })

      // Add the active class to the active tocLink.
      const activeTocLink = document.querySelector(options.tocSelector)
        .querySelector(`.${options.linkClass
          }.node-name--${topHeader.nodeName
          }[href="#${topHeader.id}"]`)
      activeTocLink.className += SPACE_CHAR + options.activeLinkClass

      const tocLists = document.querySelector(options.tocSelector)
        .querySelectorAll(`.${options.listClass}.${options.collapsibleClass}`)

      // Collapse the other collapsible lists.
      forEach.call(tocLists, list => {
        const collapsedClass = SPACE_CHAR + options.isCollapsedClass
        if (list.className.indexOf(collapsedClass) === -1) {
          list.className += SPACE_CHAR + options.isCollapsedClass
        }
      })

      // Expand the active link's collapsible list and its sibling if applicable.
      if (activeTocLink.nextSibling) {
        activeTocLink.nextSibling.className = activeTocLink.nextSibling.className.split(SPACE_CHAR + options.isCollapsedClass).join('')
      }
      removeCollapsedFromParents(activeTocLink.parentNode.parentNode)
    }
  }

  /**
   * Remove collpased class from parent elements.
   * @param {HTMLElement} element
   * @return {HTMLElement}
   */
  function removeCollapsedFromParents(element) {
    if (element.className.indexOf(options.collapsibleClass) !== -1) {
      element.className = element.className.split(SPACE_CHAR + options.isCollapsedClass).join('')
      return removeCollapsedFromParents(element.parentNode.parentNode)
    }
    return element
  }

  /**
   * Disable TOC Animation when a link is clicked.
   * @param {Event} event
   */
  function disableTocAnimation(event) {
    const target = event.target || event.srcElement
    if (typeof target.className !== 'string' || target.className.indexOf(options.linkClass) === -1) {
      return
    }
    // Bind to tocLink clicks to temporarily disable highlighting
    // while smoothScroll is animating.
    currentlyHighlighting = false
  }

  /**
   * Enable TOC Animation.
   */
  function enableTocAnimation() {
    currentlyHighlighting = true
  }

  return {
    enableTocAnimation,
    disableTocAnimation,
    render,
    updateToc,
  }
}
