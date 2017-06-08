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
import { shortBranchName } from 'utils/string';

const MainDiv = styled.div`
  margin-bottom: 20px;
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

const H2Head = styled.h2`
  margin-top: 0px;
`

const SpanStashNum = styled.span`
  margin-right: 20px;
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

const StashHead = ({
  name, repositoryId, user, variables, stashNum, totalCommit,
}) => (
  <MainDiv>
    <div>
      <H2Head>
        <SpanStashNum>Stash #{stashNum}</SpanStashNum>
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
      </H2Head>
      <div>
        <LinkUserName user={user} /> wants to push {totalCommit} commits into
        {' '}
        <LinkProject to={'master'} vars={variables}>
          <StashLabel>master</StashLabel>
        </LinkProject>
      </div>
    </div>
  </MainDiv>
)

StashHead.propTypes = {
  name: PropTypes.string.isRequired,
  repositoryId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  variables: PropTypes.object.isRequired,
  stashNum: PropTypes.number.isRequired,
  totalCommit: PropTypes.number.isRequired,
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
          stash {
            stashNum
          }
          target {
            ... on Commit {
              history(first: 99, isStash: true) {
                totalCount
              }
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
      stash: {
        stashNum,
      },
      target: {
        history: { totalCount },
        author: { user },
      },
    },
    relay: { variables },
  }) => ({
    ...stashHead,
    repositoryId: rawId,
    user,
    totalCommit: totalCount,
    variables,
    stashNum,
  })),
)(StashHead)
