import path from 'path';
import { shortBranchName } from './string';

export const getParentPath = currentPath => path.normalize(`${currentPath}/..`);

export const getProjectPath = ({ userName, projectName }) =>
  path.join('/', userName, projectName);

export const getUserProfilePath = userName =>
  path.join('/profile/', userName);

export const getBlobPath = ({ pathName, ...props }) =>
  path.join(getBranchPath(props), '/blob/', pathName);

export const getBranchPath = props =>
  path.join(
    getProjectPath(props),
    props.branchHead ? shortBranchName(props.branchHead) : 'master'
  );

export const getTreeEntryPath = props => path.join(
    getBranchPath(props),
    props.type === 'tree' ? 'tree' : 'blob'
  );

export const getCommitPath = props =>
  path.join(getBranchPath(props), 'commit');

export const getCommitsFilePath = props =>
  path.join(getBranchPath(props), '/commits/');

export const getStashPath = props =>
  path.join(getBranchPath(props), 'stash');
