import path from 'path'

export const getParentPath = currentPath => path.normalize(`${currentPath}/..`)

export const getBasePath = (userName, projectName) =>
  `/${userName}/${projectName}`

export const getBaseProjectPath = (userName, projectName, branchHead) => {
  let resPath = getBasePath(userName, projectName)
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

export const getCommitPath = (relayVars, commitId) =>
  `${getBasePath(
    relayVars.userName, relayVars.projectName
  )}/commit/${commitId}`
