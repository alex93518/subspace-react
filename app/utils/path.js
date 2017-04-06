import path from 'path'

export const getParentPath = currentPath => path.normalize(`${currentPath}/..`)

export const getBasePath = ({ userName, projectName }) =>
  `/${userName}/${projectName}`

export const getUserProfilePath = userName =>
  `/profile/${userName}`

export const getBlobPath = (relayVars, pathName) =>
  `${getBaseProjectPath(relayVars)}/blob/${pathName}`

export const getBaseProjectPath = relayVars => {
  let resPath = getBasePath(relayVars)
  if (relayVars.branchHead) {
    resPath += `/${relayVars.branchHead.replace('refs/heads/', '')}`
  }
  return resPath;
}

export const getTreeEntryPath = (
  relayVars, type, currentPath
) => {
  let resPath = getBaseProjectPath(relayVars)
  if (currentPath && currentPath !== '.') {
    resPath += `/${type === 'tree' ? 'tree' : 'blob'}/${currentPath}`
  }

  return resPath
}

export const getCommitPath = (relayVars, commitId) =>
  `${getBasePath(relayVars)}/commit/${commitId}`
