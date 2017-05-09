import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import * as links from 'utils/path';
import path from 'path';

const LinkBase = ({ pathFunc, to, vars, children, ...props }) => (
  <Link
    to={path.join(pathFunc(vars), to || '')}
    {...props}
  >
    {children}
  </Link>
)

LinkBase.propTypes = {
  pathFunc: PropTypes.func.isRequired,
  to: PropTypes.string,
  vars: PropTypes.object.isRequired,
  children: PropTypes.node,
};

export const LinkBranch = ({ ...props }) =>
  <LinkBase pathFunc={links.getBranchPath} {...props} />

export const LinkProject = ({ ...props }) =>
  <LinkBase pathFunc={links.getProjectPath} {...props} />

export const LinkTreeEntry = ({ ...props }) =>
  <LinkBase pathFunc={links.getTreeEntryPath} {...props} />

export const LinkBlob = ({ ...props }) =>
  <LinkBase pathFunc={links.getBlobPath} {...props} />

export const LinkCommit = ({ ...props }) =>
  <LinkBase pathFunc={links.getCommitPath} {...props} />

export const LinkCommitsFile = ({ ...props }) =>
  <LinkBase pathFunc={links.getCommitsFilePath} {...props} />

export * from './LinkUserName';
export * from './LinkUserPhoto';
