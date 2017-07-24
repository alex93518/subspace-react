import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, mapProps } from 'recompose';
import { shortBranchName, timeFromNow } from 'utils/string';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { LinkProject, LinkUserName } from 'components/shared/Links';

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

const Branch = ({ name, commitTime, user }) => (
  <Td>
    <LinkProject to={shortBranchName(name)}>
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
}


export default compose(
  withRelayFragment({
    branch: graphql`
      fragment Branch_branch on Ref {
        name
        target {
          ... on Commit {
            commitTime
            author {
              user {
                ...LinkUserName_user
              }
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    branch,
    branch: {
      target,
      target: {
        author: { user },
      },
    },
  }) => ({ ...branch, ...target, user })),
)(Branch)
