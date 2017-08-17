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
    display: flex;
    flex-direction: column;
  }

  body {
    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    color: #696e73;
    font-size: 14px;
  }

  body.fontLoaded {
    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
    font-size: 14px;
  }

  #app {
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
  }

  #app > [data-reactroot] { 
    display: flex;
    flex-direction: column;
  }

  p,
  label {
    font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
    line-height: 1.5em;
  }

  strong {
    font-weight: bold;
  }

  dt {
    font-weight: 500;
  }
  
  .container {
    height: 100%;
  }

  .inline-block {
    display: inline-block;
  }

  .error {
    color: red;
  }

  /* the tree node's style */
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
    margin-right: 15px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    height: 20px;
    color: rgba(0,0,0,0.4);
  }

  .tree-view_arrow:after {
    font-family: 'Glyphicons Halflings';
    content: "\\e082";
  }

  .tree-view_arrow-collapsed:after {
    font-family: 'Glyphicons Halflings';
    content: "\\e081" !important;
  }
    
  .example-enter {
    opacity: 0.01;
  }

  .example-enter.example-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }

  .example-leave {
    opacity: 1;
  }

  .example-leave.example-leave-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }

  /*
  * react-circular-progressbar styles
  *
  * All of the styles in this file are optional and configurable!
  */

  .CircularProgressbar {
    /*
    * This fixes an issue where the CircularProgressbar svg has
    * 0 width inside a "display: flex" container, and thus not visible.
    *
    * If you're not using "display: flex", you can remove this style.
    */
    width: 100%;
  }

  .CircularProgressbar .CircularProgressbar-path {
    stroke: #3e98c7;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s ease 0s;
  }

  .CircularProgressbar .CircularProgressbar-trail {
    stroke: #d6d6d6;
  }

  .CircularProgressbar .CircularProgressbar-text {
    fill: #3e98c7;
    font-size: 20px;
    dominant-baseline: middle;
    text-anchor: middle;
  }  
`;
