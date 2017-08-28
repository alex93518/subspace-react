export const getFileType = fileName =>
  fileName.toLowerCase().endsWith('.md') ? 'markdown' : 'html'

export const convertText = (fileName, text) =>
  getFileType(fileName) === 'html' ?
    text.replace(/\n/g, '<br />') : text
