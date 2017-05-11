import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { Button } from 'react-bootstrap';
import { redirect } from 'redux/utils'
import CurrentRelay, { MergeStashMutation } from 'relay';
import { compose, mapProps } from 'recompose';
import { createContainer } from 'recompose-relay'
import styled from 'styled-components';
import { getProjectPath } from 'utils/path';
import { LinkUserName, LinkProject } from 'components/shared/Links';
import { shortBranchName, timeFromNow } from 'utils/string';

const TdMain = styled.td`
  padding: 10px 18px !important;
  vertical-align: middle !important;
`
const TdAcceptStash = styled.td`
  text-align: right;
  padding-right: 24px !important;
`
const StashLabel = styled.span`
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-weight: 600;
  background-color: #eaf5ff;
  color: #0366d6;
  border-radius: 3px;
  font-size: 13px;
  padding: 4px 8px;
  margin-right: 10px;
`

const handleSubmit = ({ ...props }, relayVars) => {
  CurrentRelay.Store.commitUpdate(
    new MergeStashMutation({
      ...props,
    }),
    {
      onSuccess: () => redirect(`${getProjectPath(relayVars)}/master`),
      onFailure: transaction => console.log(transaction.getError()),
    }
  )
}

const StashHead = ({ name, commitTime, repositoryId, user, variables }) => (
  <tr>
    <TdMain>
      <LinkProject to={shortBranchName(name)} vars={variables}>
        <StashLabel>
          {shortBranchName(name)}
        </StashLabel>
      </LinkProject>
      <span>
        Updated {timeFromNow(commitTime)} by
        {' '}
        <LinkUserName user={user} />
      </span>
    </TdMain>
    <TdAcceptStash>
      <Button
        className="btn btn-info btn-sm"
        onClick={() =>
          handleSubmit({
            repositoryId,
            stashName: shortBranchName(name),
          }, variables)
        }
      >
        Accept
      </Button>
    </TdAcceptStash>
  </tr>
)

StashHead.propTypes = {
  name: PropTypes.string.isRequired,
  commitTime: PropTypes.number.isRequired,
  repositoryId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  variables: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      stashHead: () => Relay.QL`
        fragment on Ref {
          name
          repository {
            rawId
          }
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
    stashHead,
    stashHead: {
      repository: {
        rawId,
      },
      target: {
        commitTime,
        author: { user },
      },
    },
    relay: { variables },
  }) => ({
    ...stashHead,
    repositoryId: rawId,
    user,
    commitTime,
    variables,
  })),
)(StashHead)
