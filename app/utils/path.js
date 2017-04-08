import path from 'path';
import { shortBranchName } from './string';

export const getParentPath = currentPath => path.normalize(`${currentPath}/..`)

export const getProjectPath = ({ userName, projectName }) =>
  path.join('/', userName, projectName)

export const getUserProfilePath = userName =>
  path.join('/profile/', userName)

export const getBlobPath = ({ pathName, ...props }) =>
  path.join(getBranchPath(props), '/blob/', pathName)

export const getBranchPath = ({ branchHead, ...props }) =>
  path.join(
    getProjectPath(props),
    branchHead ? shortBranchName(branchHead) : ''
  )

export const getTreeEntryPath = ({ type, pathName, ...props }) =>
  path.join(
    getBranchPath(props),
    (pathName && pathName !== '.') ?
      `/${type === 'tree' ? 'tree' : 'blob'}/${pathName}` : ''
  )

export const getCommitPath = ({ commitId, ...props }) =>
  path.join(getBranchPath(props), 'commit', commitId)
