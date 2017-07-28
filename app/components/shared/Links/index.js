import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter, Link } from 'react-router-dom';
import * as links from 'utils/path';
import path from 'path';
import { matchRoute } from 'utils/routeMatcher';

const LinkBase = ({
  location: { pathname }, pathFunc, to, children, vars,
  match, history, staticContext, // eslint-disable-line
  ...props
}) => (
  <Link
    to={path.join(pathFunc(matchRoute(pathname).params, vars), to || '')}
    {...props}
  >
    {children}
  </Link>
)

LinkBase.propTypes = {
  location: PropTypes.object.isRequired,
  pathFunc: PropTypes.func.isRequired,
  to: PropTypes.string,
  vars: PropTypes.object,
  children: PropTypes.node,
};

const LinkBaseWithRouter = compose(
  withRouter
)(LinkBase);

export const LinkBranch = ({ ...props }) =>
  <LinkBaseWithRouter pathFunc={links.getBranchPath} {...props} />;

export const LinkProject = ({ ...props }) =>
  <LinkBaseWithRouter pathFunc={links.getProjectPath} {...props} />;

export const LinkTreeEntry = ({ type, ...props }) =>
  <LinkBaseWithRouter pathFunc={links.getTreeEntryPath} vars={{ type }} {...props} />;

LinkTreeEntry.propTypes = {
  type: PropTypes.string,
};

export const LinkBlob = ({ ...props }) =>
  <LinkBaseWithRouter pathFunc={links.getBlobPath} {...props} />;

export const LinkCommit = ({ ...props }) =>
  <LinkBaseWithRouter pathFunc={links.getCommitPath} {...props} />;

export const LinkCommitsFile = ({ ...props }) =>
  <LinkBaseWithRouter pathFunc={links.getCommitsFilePath} {...props} />;

export const LinkStash = ({ ...props }) =>
  <LinkBaseWithRouter pathFunc={links.getStashPath} {...props} />;

export * from './LinkUserName';
export * from './LinkUserPhoto';
