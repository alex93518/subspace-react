import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { Col, Modal, Image, Media } from 'react-bootstrap';
import { voteStashMutation, mergeStashMutation } from 'relay';
import { compose, withState, mapProps, withHandlers } from 'recompose';
import { redirect } from 'redux/utils';
import { LinkUserName, LinkProject } from 'components/shared/Links';
import { getProjectPath } from 'utils/path';
import {
  MainRow, AcceptModal, MediaLeft, MediaBody, AcceptHead,
  IconCol, IconUp, NumberDiv, IconDown, ColStatus, H2Head,
  SpanStashNum, StashLabel, RowVoteStats, SpanAcceptPoint, SpanRejectPoint,
} from './styles';

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
            props.updateIsMerging(true);
            mergeStashMutation({
              id: props.repository.id,
              stashName: props.name,
              repositoryId: props.repository.rawId,
              onCompleted: () => {
                props.updateIsMerging(false);
                redirect(`${getProjectPath(props.variables)}/master`);
              },
            })
          }
        },
      });
    },
  })
)(StashHead)
