import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { voteStashMutation, mergeStashMutation } from 'relay';
import { compose, withState, mapProps, withHandlers } from 'recompose';
import { withRouter } from 'react-router';
import { matchRoute } from 'utils/routeMatcher';
import { redirect } from 'redux/utils';
import { getProjectPath } from 'utils/path';
import CircularProgressbar from 'react-circular-progressbar';
import pluralize from 'pluralize';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import MdCheck from 'react-icons/lib/md/check';
import MdClear from 'react-icons/lib/md/clear';
import MdEdit from 'react-icons/lib/md/edit';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import { SpanAccept, SpanReject } from './styles';

pluralize.addIrregularRule('is', 'are')

const Votes = ({
  pendingRefStash: { acceptVotes, rejectVotes },
  totalCount, votePercentage,
  ...rest
}) => (
  <Card style={{ marginTop: 10 }}>
    <CardHeader
      title="Votes"
      subtitle={(
        <span>
          There{' '}
          {pluralize('is', totalCount)}{' '}
          {pluralize('voter', totalCount, true)}{' with total of '}
          <SpanAccept>
            {acceptVotes.totalVotePoints}
          </SpanAccept>{' '}
          {pluralize(
            'acceptance point',
            acceptVotes.totalVotePoints
          )}{' and '}
          <SpanReject>
            {rejectVotes.totalVotePoints}
          </SpanReject>{' '}
          {pluralize(
            'rejection point',
            rejectVotes.totalVotePoints
          )}
        </span>
      )}
      avatar={
        <Avatar style={{ backgroundColor: 'inherit' }}>
          <CircularProgressbar
            percentage={votePercentage}
          />
        </Avatar>
      }
      showExpandableButton
      actAsExpander
    />
    <CardText expandable>
      <Paper zDepth={1}>
        <BottomNavigation selectedIndex={rest.voteIndex}>
          <BottomNavigationItem
            label="Accept"
            icon={<MdCheck width={24} height={24} />}
            onTouchTap={() => rest.onVote(true)}
          />
          <BottomNavigationItem
            label="Reject"
            icon={<MdClear width={24} height={24} />}
            onTouchTap={() => rest.onVote(false)}
          />
          <BottomNavigationItem
            label="After Suggested Changes"
            icon={<MdEdit width={24} height={24} />}
            onTouchTap={() => ({})}
          />
        </BottomNavigation>
      </Paper>
    </CardText>
  </Card>
)

Votes.propTypes = {
  pendingRefStash: PropTypes.object.isRequired,
  totalCount: PropTypes.number.isRequired,
  votePercentage: PropTypes.number.isRequired,
}

export default compose(
  withRelayFragment({
    pendingRefStash: graphql`
      fragment Votes_pendingRefStash on Stash {
        rawId
        voteTreshold
        votes {
          totalCount
          totalVotePoints
        }
        isUserVoted
        acceptVotes {
          totalVotePoints
        }
        rejectVotes {
          totalVotePoints
        }
      }
    `,
  }),
  withRouter,
  withState(
    'isVotedUp', 'updateIsVotedUp',
    props => !!props.pendingRefStash.isUserVoted
  ),
  withState(
    'isVotedDown', 'updateIsVotedDown',
    props => (
      props.pendingRefStash.isUserVoted == null ?
        false : !props.pendingRefStash.isUserVoted
    )
  ),
  withState('isMerging', 'updateIsMerging', false),
  mapProps(props => {
    const {
      pendingRefStash,
      pendingRefStash: {
        voteTreshold,
        votes: { totalCount, totalVotePoints },
      },
      location: { pathname },
      isVotedUp,
      isVotedDown,
    } = props

    let voteIndex = null;
    if (isVotedUp) {
      voteIndex = 0;
    }
    if (isVotedDown) {
      voteIndex = 1;
    }

    return {
      stash: pendingRefStash,
      totalCount: totalCount || 0,
      votePercentage: totalVotePoints <= 0 ? 0 :
        Math.round((totalVotePoints / voteTreshold) * 100),
      variables: matchRoute(pathname).params,
      voteIndex,
      ...props,
    }
  }),
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
                redirect(`${getProjectPath(props.variables)}`);
              },
            })
          }
        },
      });
    },
  })
)(Votes)
