import React from 'react';
import PropTypes from 'prop-types';
import { compose, mapProps } from 'recompose';
import { shortBranchName, timeFromNow } from 'utils/string';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { LinkProject, LinkUserName } from 'components/shared/Links';
import { Td, LabelBranch } from './styles'

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
      <LinkUserName userName={user.userName} />
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
    branchRef: graphql`
      fragment Branch_branchRef on Ref {
        name
        target {
          ... on Commit {
            commitTime
            author {
              user {
                userName
              }
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    branchRef,
    branchRef: {
      target,
      target: {
        author: { user },
      },
    },
  }) => ({ ...branchRef, ...target, user })),
)(Branch)
