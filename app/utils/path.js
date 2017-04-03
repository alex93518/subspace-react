export const getParentPath = path => {
  const upPath = path.split('/')
  upPath.splice(-1, 1)
  return upPath.count === 0 ? '' : upPath.join('/')
}

export const getTreeEntryPath = (
  userName, projectName, type, branchHead, currentPath
) => {
  let path = `/${userName}/${projectName}`
  if (branchHead) path += `/${branchHead.replace('refs/heads/', '')}`
  if (currentPath) {
    path += `/${type === 'tree' ?
      'tree' : 'blob'}/${currentPath}`
  }
  return path
}
