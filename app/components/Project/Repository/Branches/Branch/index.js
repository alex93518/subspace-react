import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { compose, mapProps } from 'recompose';
import { createContainer } from 'recompose-relay'
import { LinkProject, LinkUserName } from 'components/shared/Links';
import { shortBranchName, timeFromNow } from 'utils/string';

const Td = styled.td`
  padding: 18px !important;
  & span {
    margin-left: 7px;
  }
`

const LabelBranch = styled.span`
  font: 12px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  padding: 2px 6px;
  background-color: #eaf5ff;
  color: #0366d6;
  border-radius: 3px;
`

const Branch = ({ name, commitTime, user, variables }) => (
  <Td>
    <LinkProject to={shortBranchName(name)} vars={variables}>
      <LabelBranch>
        {shortBranchName(name)}
      </LabelBranch>
    </LinkProject>
    <span>
      Updated {timeFromNow(commitTime)} by
      {' '}
      <LinkUserName user={user} />
    </span>
  </Td>
)

Branch.propTypes = {
  name: PropTypes.string.isRequired,
  commitTime: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  variables: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      userName: null,
      projectName: null,
    },
    fragments: {
      branch: () => Relay.QL`
        fragment on Ref {
          name
          target {
            ... on Commit {
              commitTime
              author {
                user {
                  ${LinkUserName.getFragment('user')}
                }
              }
            }
          }
        }
      `,
    },
  }),
  mapProps(({
    branch,
    branch: {
      target,
      target: {
        author: { user },
      },
    },
    relay: { variables },
  }) => ({ ...branch, ...target, user, variables })),
)(Branch)
