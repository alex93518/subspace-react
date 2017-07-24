import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { Row, Col, Modal, Image, Media } from 'react-bootstrap';
import { voteStashMutation } from 'relay';
// import { mergeStashMutation } from 'relay';
import { compose, withState, mapProps, withHandlers } from 'recompose';
// import { redirect } from 'redux/utils';
import styled from 'styled-components';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import { LinkUserName, LinkProject } from 'components/shared/Links';
// import { getProjectPath } from 'utils/path';

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
  font-size: 48px;
  cursor: pointer;
  margin-top: -10px;
  color: ${props => props['data-isVotedUp'] ? '#2cbe4e' : '#aaa'};
`

const IconDown = styled(FaCaretDown)`
  font-size: 48px;
  cursor: pointer;
  color: ${props => props['data-isVotedDown'] ? '#cb2431' : '#aaa'};
`

const NumberDiv = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #777;
`

const IconCol = styled(Col)`
  padding-left: 15px;
  padding-right: 0px;
  text-align: center;
`

const RowVoteStats = styled(Row)`
  margin-top: 10px;
`

const SpanAcceptPoint = styled.span`
  font-weight: 700;
  color: #2cbe4e;
`

const SpanRejectPoint = styled.span`
  font-weight: 700;
  color: #cb2431;
`

const ColStatus = styled(Col)`
  padding-left: 30px;
`

const AcceptModal = styled(Modal)`
  position: fixed;
  top: 50% !important;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 250px;
  .modal-dialog {
    width: 250px;
  }
  .modal-body {
    width: 250px;
  }
`

const MediaBody = styled(Media.Body)`
  padding-left: 13px;
`

const MediaLeft = styled(Media.Left)`
  padding-top: 5px;
`

const AcceptHead = styled.h4`
  margin-top: 5px;
`

const StashHead = ({
  user, stashNum, totalCommit, onVote,
  totalVotePoints, isVotedUp, isVotedDown, voteTreshold,
  acceptVotes, rejectVotes, isMerging, updateIsMerging,
}) => (
  <MainRow>
    <AcceptModal show={isMerging} onHide={() => updateIsMerging(false)}>
      <Modal.Body>
        <Media>
          <MediaLeft>
            <Image src={'/ajaxSpinner.gif'} width={40} height={40} />
          </MediaLeft>
          <MediaBody>
            <AcceptHead>Accepted</AcceptHead>
            Merging...
          </MediaBody>
        </Media>
      </Modal.Body>
    </AcceptModal>
    <IconCol md={1}>
      <IconUp onClick={() => onVote(true)} data-isVotedUp={isVotedUp} />
      <NumberDiv>
        { totalVotePoints || '0' } of { voteTreshold }
      </NumberDiv>
      <IconDown onClick={() => onVote(false)} data-isVotedDown={isVotedDown} />
    </IconCol>
    <ColStatus md={11}>
      <H2Head>
        <SpanStashNum>Stash #{stashNum}</SpanStashNum>
      </H2Head>
      <div>
        <LinkUserName user={user} /> wants to push {totalCommit} commits into
        {' '}
        <LinkProject to={'master'}>
          <StashLabel>master</StashLabel>
        </LinkProject>
      </div>
      <RowVoteStats>
        <Col md={12}>
          <div>
            <SpanAcceptPoint>
              {acceptVotes.totalVotePoints}
            </SpanAcceptPoint> acceptance points from
            {` ${acceptVotes.totalCount}`} users.
          </div>
          <div>
            <SpanRejectPoint>
              {rejectVotes.totalVotePoints}
            </SpanRejectPoint> rejection points from
            {` ${rejectVotes.totalCount}`} users.
          </div>
        </Col>
      </RowVoteStats>
    </ColStatus>
  </MainRow>
)

StashHead.propTypes = {
  user: PropTypes.object.isRequired,
  stashNum: PropTypes.number.isRequired,
  totalCommit: PropTypes.number.isRequired,
  onVote: PropTypes.func.isRequired,
  totalVotePoints: PropTypes.number.isRequired,
  voteTreshold: PropTypes.number.isRequired,
  isVotedUp: PropTypes.bool.isRequired,
  isVotedDown: PropTypes.bool.isRequired,
  acceptVotes: PropTypes.object.isRequired,
  rejectVotes: PropTypes.object.isRequired,
  isMerging: PropTypes.bool.isRequired,
  updateIsMerging: PropTypes.func.isRequired,
}

export default compose(
  withRelayFragment({
    stashHead: graphql`
      fragment Head_stashHead on Ref {
        name
        repository {
          id
          rawId
        }
        stash {
          id
          rawId
          stashNum
          voteTreshold
          votes (first: 9999) {
            totalVotePoints
          }
          isUserVoted
          acceptVotes {
            totalCount
            totalVotePoints
          }
          rejectVotes {
            totalCount
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
                ...LinkUserName_user
              }
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    repository,
    stashHead: {
      stash,
      stash: {
        votes: {
          totalVotePoints,
        },
        acceptVotes,
        rejectVotes,
        voteTreshold,
        stashNum,
      },
      target: {
        history: { totalCount },
        author: { user },
      },
      ...rest
    },
  }) => ({
    totalVotePoints,
    totalCommit: totalCount,
    stashNum,
    user,
    voteTreshold,
    stash,
    acceptVotes,
    rejectVotes,
    repository,
    ...rest,
  })),
  withState(
    'isVotedUp', 'updateIsVotedUp',
    props => !!props.stash.isUserVoted
  ),
  withState(
    'isVotedDown', 'updateIsVotedDown',
    props => (
      props.stash.isUserVoted == null ?
        false : !props.stash.isUserVoted
    )
  ),
  withState('isMerging', 'updateIsMerging', false),
  withHandlers({
    toggleVote: props => isVoteUp => {
      if (
        isVoteUp === null ||
        (isVoteUp && isVoteUp === props.isVotedUp) ||
        (!isVoteUp && !isVoteUp === props.isVotedDown)
      ) {
        props.updateIsVotedUp(false);
        props.updateIsVotedDown(false);
      } else if (isVoteUp) {
        props.updateIsVotedUp(true);
        props.updateIsVotedDown(false);
      } else {
        props.updateIsVotedUp(false);
        props.updateIsVotedDown(true);
      }
    },
  }),
  withHandlers({
    onVote: props => isVoteUp => {
      const prevIsVotedUp = props.isVotedUp;
      const prevIsVotedDown = props.isVotedDown;
      const voteVar = typeof (isVoteUp) === 'boolean' ? isVoteUp : null;
      props.toggleVote(voteVar);
      voteStashMutation({
        isVoteUp,
        stashId: props.stash.rawId || null,
        onCompleted: resp => {
          if (resp.voteStash.clientMutationId === null) {
            props.updateIsVotedUp(prevIsVotedUp);
            props.updateIsVotedDown(prevIsVotedDown);

            // TODO: add login first flow
            alert('Login first');
            return;
          }

          const { voteStash: { stash } } = resp;
          const acceptVotePoints = stash.acceptVotes.totalVotePoints;
          const rejectVotePoints = stash.rejectVotes.totalVotePoints;
          const totalPoints = acceptVotePoints + rejectVotePoints;
          if (totalPoints >= stash.voteTreshold) {
            console.log(totalPoints);
          }
        },
      });
      // CurrentRelay.Store.commitUpdate(
      //   new VoteStashMutation({
      //     id: props.stash.id,
      //     isVoteUp,
      //     stashId: props.stash.rawId || null,
      //   }),
      //   {
      //     onSuccess: (resp) => {
      //       const { voteStash: { stash } } = resp;
      //       const acceptVotePoints = stash.acceptVotes.totalVotePoints;
      //       const rejectVotePoints = stash.rejectVotes.totalVotePoints;
      //       const totalPoints = acceptVotePoints + rejectVotePoints;
      //       if (totalPoints >= stash.voteTreshold) {
      //         props.updateIsMerging(true);
      //         CurrentRelay.Store.commitUpdate(
      //           new MergeStashMutation({
      //             id: props.repository.id,
      //             stashName: props.name,
      //             repositoryId: props.repository.rawId,
      //           }),
      //           {
      //             onSuccess: () => {
      //               props.updateIsMerging(false);
      //               redirect(`${getProjectPath(props.variables)}/master`);
      //             },
      //             onFailure: (transaction) => console.log(transaction.getError()),
      //           }
      //         );
      //       }
      //     },
      //     onFailure: (transaction) => console.log(transaction.getError()),
      //   }
      // );
    },
  })
)(StashHead)
