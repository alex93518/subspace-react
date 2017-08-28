import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import marked from 'marked';

const configs = {
  modules: {
    toolbar: null,
  },
}

const BlobMarkdown = ({ text }) => (
  <ReactQuill
    readOnly
    theme="snow"
    value={marked(text)}
    modules={configs.modules}
  />
)

BlobMarkdown.propTypes = {
  text: PropTypes.string.isRequired,
}

export default BlobMarkdown
