import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  @font-face {
    font-family: 'Glyphicons Halflings';
    src: url('/fonts/glyphicons-halflings-regular.eot');
    src: url('/fonts/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'), url('/fonts/glyphicons-halflings-regular.woff') format('woff'), url('/fonts/glyphicons-halflings-regular.ttf') format('truetype'), url('/fonts/glyphicons-halflings-regular.svg#glyphicons-halflingsregular') format('svg');
  }

  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #696e73;
  }

  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.5em;
  }

  strong {
    font-weight: bold;
  }

  /* the tree node's style */
  .tree-view {
    overflow-y: hidden;
  }

  .tree-view_item {
    display: -webkit-flex;
    display: flex;
  }

  /* style for the children nodes container */
  .tree-view_children {
    margin-left: 40px;
  }

  .tree-view_children-collapsed {
    height: 0px;
  }

  .tree-view_arrow {
    cursor: pointer;
    margin-right: 10px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 25px;
  }

  .tree-view_arrow:after {
    content: '[ - ]';
  }

  .tree-view_arrow-collapsed:after {
    content: '[ + ]' !important;
  }
`;
