import path from 'path'

export const getParentPath = currentPath => path.normalize(`${currentPath}/..`)

export const getTreeEntryPath = (
  userName, projectName, type, branchHead, currentPath
) => {
  let resPath = `/${userName}/${projectName}`
  if (branchHead) resPath += `/${branchHead.replace('refs/heads/', '')}`
  if (currentPath && currentPath !== '.') {
    resPath += `/${type === 'tree' ? 'tree' : 'blob'}/${currentPath}`
  }

  return resPath
}
