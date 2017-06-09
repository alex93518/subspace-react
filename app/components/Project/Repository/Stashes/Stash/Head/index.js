import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { Row, Col } from 'react-bootstrap';
import CurrentRelay, { VoteStashMutation } from 'relay';
import { compose, withState, mapProps, withHandlers } from 'recompose';
import { createContainer } from 'recompose-relay'
import styled from 'styled-components';
import { FaCaretUp, FaCaretDown } from 'react-icons/lib/fa';
import { LinkUserName, LinkProject } from 'components/shared/Links';

const MainRow = styled(Row)`
  margin-bottom: 20px;
  border: 0px;
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

const IconUp = styled(FaCaretUp)`
  font-size: 38px;
  cursor: pointer;
  color: ${props => props['data-isVotedUp'] ? '#3c9f3c' : '#aaa'};
`

const IconDown = styled(FaCaretDown)`
  font-size: 38px;
  cursor: pointer;
  color: ${props => props['data-isVotedDown'] ? '#3c9f3c' : '#aaa'};
`

const NumberDiv = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #444;
`

const IconCol = styled(Col)`
  padding-left: 0px;
  padding-right: 0px;
  text-align: center;
`

const StashHead = ({
  user, variables, stashNum, totalCommit, onVote,
  totalVotePoints, isVotedUp, isVotedDown,
}) => (
  <MainRow>
    <IconCol md={1}>
      <IconUp onClick={() => onVote(true)} data-isVotedUp={isVotedUp} />
      <NumberDiv>
        { totalVotePoints || '0' }
      </NumberDiv>
      <IconDown onClick={() => onVote(false)} data-isVotedDown={isVotedDown} />
    </IconCol>
    <Col md={11}>
      <H2Head>
        <SpanStashNum>Stash #{stashNum}</SpanStashNum>
      </H2Head>
      <div>
        <LinkUserName user={user} /> wants to push {totalCommit} commits into
        {' '}
        <LinkProject to={'master'} vars={variables}>
          <StashLabel>master</StashLabel>
        </LinkProject>
      </div>
      <h5>
        Accepts (0)
      </h5>
      <h5>
        Rejects (0)
      </h5>
    </Col>
  </MainRow>
)

StashHead.propTypes = {
  user: PropTypes.object.isRequired,
  variables: PropTypes.object.isRequired,
  stashNum: PropTypes.number.isRequired,
  totalCommit: PropTypes.number.isRequired,
  onVote: PropTypes.func.isRequired,
  totalVotePoints: PropTypes.number.isRequired,
  isVotedUp: PropTypes.bool.isRequired,
  isVotedDown: PropTypes.bool.isRequired,
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
          id
          rawId
          stash {
            rawId
            stashNum
            votes {
              totalVotePoints
            }
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
  withState('isVotedUp', 'updateIsVotedUp', false),
  withState('isVotedDown', 'updateIsVotedDown', false),
  mapProps(({
    stashHead,
    stashHead: {
      stash,
      stash: {
        votes: { totalVotePoints },
      },
      target: {
        history: { totalCount },
        author: { user },
      },
    },
    relay: { variables },
    ...rest
  }) => ({
    totalVotePoints,
    totalCommit: totalCount,
    stashNum: stash.stashNum,
    user,
    variables,
    ...rest,
  })),
  withHandlers({
    toggleVote: props => isVoteUp => {
      if (isVoteUp === null) {
        props.updateIsVotedUp(false)
        props.updateIsVotedDown(false)
      } else if (isVoteUp) {
        props.updateIsVotedUp(true)
        props.updateIsVotedDown(false)
      } else {
        props.updateIsVotedUp(false)
        props.updateIsVotedDown(true)
      }
    },
  }),
  withHandlers({
    onVote: props => isVoteUp => {
      const voteVar = typeof (isVoteUp) === 'boolean' ? isVoteUp : null
      props.toggleVote(voteVar)
      CurrentRelay.Store.commitUpdate(
        new VoteStashMutation({
          isVoteUp,
          stashId: props.stash.rawId || null,
          stashRefId: props.rawId,
        }),
        {
          onSuccess: () => console.log('vote success'),
          onFailure: transaction => console.log(transaction.getError()),
        }
      )
    },
  })
)(StashHead)
