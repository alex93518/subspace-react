import React from 'react';
import PropTypes from 'prop-types';
import { compose, mapProps } from 'recompose';
import { withRouter, Link } from 'react-router-dom';
import * as links from 'utils/path';
import path from 'path';
import { matchRoute } from 'utils/routeMatcher';

const LinkBase = ({
  pathFunc, to, children, vars,
  ...props
}) => (
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
  vars: PropTypes.object,
  children: PropTypes.node,
};

const LinkBaseRouter = compose(
  withRouter,
  mapProps(({
    location: { pathname },
    match, location, history, staticContext, joinVars,
    ...rest
  }) => {
    let isRouter = false;
    if (typeof rest.isRouter === 'undefined') {
      isRouter = true
    } else {
      isRouter = rest.isRouter
    }

    const baseVars = isRouter ? matchRoute(pathname).params : rest.vars
    const vars = joinVars ? { ...baseVars, ...joinVars } : baseVars
    return ({
      vars,
      ...rest,
    })
  })
)(LinkBase);

export const LinkBranch = ({ ...props }) =>
  <LinkBaseRouter pathFunc={links.getBranchPath} {...props} />;

export const LinkProject = ({ ...props }) =>
  <LinkBaseRouter pathFunc={links.getProjectPath} {...props} />;

export const LinkTreeEntry = ({ type, ...props }) =>
  <LinkBaseRouter pathFunc={links.getTreeEntryPath} joinVars={{ type }} {...props} />;

LinkTreeEntry.propTypes = {
  type: PropTypes.string,
};

export const LinkBlob = ({ ...props }) =>
  <LinkBaseRouter pathFunc={links.getBlobPath} {...props} />;

export const LinkCommit = ({ ...props }) =>
  <LinkBaseRouter pathFunc={links.getCommitPath} {...props} />;

export const LinkCommitsFile = ({ ...props }) =>
  <LinkBaseRouter pathFunc={links.getCommitsFilePath} {...props} />;

export const LinkStash = ({ ...props }) =>
  <LinkBaseRouter pathFunc={links.getStashPath} {...props} />;

export * from './LinkUserName';
export * from './LinkUserPhoto';
