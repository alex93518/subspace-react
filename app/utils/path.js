import path from 'path'

export const getParentPath = currentPath => path.normalize(`${currentPath}/..`)

export const getBaseProjectPath = (userName, projectName, branchHead) => {
  let resPath = `/${userName}/${projectName}`
  if (branchHead) resPath += `/${branchHead.replace('refs/heads/', '')}`
  return resPath;
}

export const getTreeEntryPath = (
  userName, projectName, type, branchHead, currentPath
) => {
  let resPath = getBaseProjectPath(userName, projectName, branchHead)
  if (currentPath && currentPath !== '.') {
    resPath += `/${type === 'tree' ? 'tree' : 'blob'}/${currentPath}`
  }

  return resPath
}
