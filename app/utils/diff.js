import R from 'ramda';
import parse from 'parse-diff';

export const parseDiff = commitDiff => commitDiff.diff.map(file => ({
  ...file,
  hunks: parse(file.diff),
}))

export const totalHunk = (propName, diff) => R.pipe(
  R.map(R.path(['hunks'])),
  R.map(R.map(R.prop(propName))),
  R.flatten,
  R.reduce(R.add, 1),
  R.add(-1)
)(diff)

const getLinesNumber = (content, nullSeq) =>
  content.length + Object.values(nullSeq).reduce(R.add, 0)

export const getDiffContent = chunk => {
  const oldContent = []
  const newContent = []

  // Empty sequence descriptors { [startLine]: sequenceLength }
  const oldNullSeq = {}
  const newNullSeq = {}

  let lineDiff = chunk.oldStart - chunk.newStart

  chunk.changes.forEach(change => {
    if (change.content !== '\\ No newline at end of file') {
      if (change.type === 'normal') {
        const changeLineDiff = change.ln1 - change.ln2
        const emptyLinesNumber = Math.abs(lineDiff - changeLineDiff)

        if (changeLineDiff < lineDiff) {
          oldNullSeq[oldContent.length] = emptyLinesNumber
          lineDiff -= emptyLinesNumber
        } else if (changeLineDiff > lineDiff) {
          newNullSeq[newContent.length] = emptyLinesNumber
          lineDiff += emptyLinesNumber
        }

        oldContent.push(change.content)
        newContent.push(change.content)
      } else if (change.type === 'del') {
        oldContent.push(change.content)
      } else if (change.type === 'add') {
        newContent.push(change.content)
      }
    }
  })

  const oldLength = getLinesNumber(oldContent, oldNullSeq)
  const newLength = getLinesNumber(newContent, newNullSeq)

  // Add empty lines to the largest content
  if (oldLength === newLength) {
    const lineNumberDiff = oldLength - newLength

    lineNumberDiff < 0
      ? oldNullSeq[oldLength] = lineNumberDiff
      : newNullSeq[newLength] = lineNumberDiff
  }

  return {
    oldContent: oldContent.join('\r\n'),
    newContent: newContent.join('\r\n'),
    oldNullSeq,
    newNullSeq,
  }
}

export const getDiffChanges = (chunk, type) => R.pipe(
  R.filter(_ => _.type === type),
  R.map(R.prop('ln')),
  R.map(R.add(type === 'del' ? -(chunk.oldStart - 1) : -(chunk.newStart - 1)))
)(chunk.changes)
