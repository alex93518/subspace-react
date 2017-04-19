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

const arrayToSeq = array => {
  const nullIdx = []
  const seqNum = []
  let setStart = null
  let current = null
  let seqFound = 1
  for (let i = 0; i < array.length; i += 1) {
    if (current === null) {
      setStart = array[i]
      current = array[i]
    }
    if (array[i + 1] && array[i] === array[i + 1] - 1) {
      seqFound += 1
    } else {
      nullIdx.push(setStart)
      seqNum.push(seqFound)
      setStart = null
      current = null
      seqFound = 1
    }
  }
  return { idx: nullIdx, seq: seqNum }
}

export const getDiffContent = chunk => {
  const oldContent = []
  const newContent = []
  let lineDiff = chunk.oldStart - chunk.newStart
  chunk.changes.forEach(change => {
    if (change.content !== '\\ No newline at end of file') {
      if (change.ln1) {
        const changeLineDiff = change.ln1 - change.ln2
        if (changeLineDiff < lineDiff) {
          const nullNum = lineDiff - changeLineDiff
          for (let index = 0; index < nullNum; index += 1) {
            oldContent.push(null)
          }
          lineDiff -= nullNum
        } else if (changeLineDiff > lineDiff) {
          const nullNum = changeLineDiff - lineDiff
          for (let index = 0; index < nullNum; index += 1) {
            newContent.push(null)
          }
          lineDiff += nullNum
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
  if (oldContent.length !== newContent.length) {
    const lineDiffEof = oldContent.length - newContent.length
    if (lineDiffEof < 0) {
      for (let i = 0; i < -(lineDiffEof); i += 1) {
        oldContent.push(null)
      }
    } else {
      for (let i = 0; i < lineDiffEof; i += 1) {
        newContent.push(null)
      }
    }
  }

  const contentNotNull = R.filter(_ => _ !== null)
  const nullIndex = R.pipe(
      R.addIndex(R.map)((val, idx) => ({ val, idx })),
      R.filter(_ => _.val === null),
      R.map(R.prop('idx'))
    )

  return {
    oldContent: contentNotNull(oldContent).join('\r\n'),
    newContent: contentNotNull(newContent).join('\r\n'),
    oldNullIdx: arrayToSeq(nullIndex(oldContent)),
    newNullIdx: arrayToSeq(nullIndex(newContent)),
  }
}

export const getDiffChanges = (chunk, type) => R.pipe(
  R.filter(_ => _.type === type),
  R.map(R.prop('ln')),
  R.map(R.add(type === 'del' ? -(chunk.oldStart - 1) : -(chunk.newStart - 1)))
)(chunk.changes)
