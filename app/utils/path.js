import path from 'path'

export const getParentPath = currentPath => path.normalize(`${currentPath}/..`)

export const getBasePath = (userName, projectName) =>
  `/${userName}/${projectName}`

export const getUserProfilePath = userName =>
  `/profile/${userName}`

export const getBlobPath = (relayVars, pathName) =>
  `${getBaseProjectPath(
    relayVars.userName,
    relayVars.projectName,
    relayVars.branchHead
  )}/blob/${pathName}`

export const getBaseProjectPath = (userName, projectName, branchHead) => {
  let resPath = getBasePath(userName, projectName)
  if (branchHead) resPath += `/${branchHead.replace('refs/heads/', '')}`
  return resPath;
}

export const getTreeEntryPath = (
  relayVars, type, currentPath
) => {
  let resPath = getBaseProjectPath(
    relayVars.userName,
    relayVars.projectName,
    relayVars.branchHead
  )
  if (currentPath && currentPath !== '.') {
    resPath += `/${type === 'tree' ? 'tree' : 'blob'}/${currentPath}`
  }

  return resPath
}

export const getCommitPath = (relayVars, commitId) =>
  `${getBasePath(
    relayVars.userName, relayVars.projectName
  )}/commit/${commitId}`
