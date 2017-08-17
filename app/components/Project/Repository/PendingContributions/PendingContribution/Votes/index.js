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
import Card, { CardHeader, CardContent } from 'components/shared/Card';
import Avatar from 'material-ui/Avatar';
import MdCheck from 'react-icons/lib/md/check';
import MdClear from 'react-icons/lib/md/clear';
import MdEdit from 'react-icons/lib/md/edit';
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import { SpanAccept, SpanReject } from './styles';

pluralize.addIrregularRule('is', 'are')

const Votes = ({
  stash: { acceptVotes, rejectVotes },
  totalCount, votePercentage, voteIndex,
  ...rest
}) => (
  <Card style={{ marginTop: 10 }}>
    <CardHeader
      title="Votes"
      subheader={(
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
    />
    <CardContent>
      <Paper elevation={1}>
        <BottomNavigation value={voteIndex}>
          <BottomNavigationButton
            label="Accept"
            icon={<MdCheck width={24} height={24} />}
            onClick={() => rest.onVote(true)}
          />
          <BottomNavigationButton
            label="Reject"
            icon={<MdClear width={24} height={24} />}
            onClick={() => rest.onVote(false)}
          />
          <BottomNavigationButton
            label="After Suggested Changes"
            icon={<MdEdit width={24} height={24} />}
            onClick={() => ({})}
          />
        </BottomNavigation>
      </Paper>
    </CardContent>
  </Card>
)

Votes.propTypes = {
  stash: PropTypes.object.isRequired,
  totalCount: PropTypes.number.isRequired,
  votePercentage: PropTypes.number.isRequired,
  voteIndex: PropTypes.number,
}

export default compose(
  withRelayFragment({
    stash: graphql`
      fragment Votes_stash on Stash {
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
  mapProps(props => {
    const {
      stash: {
        voteTreshold,
        votes,
      },
      location: { pathname },
      isVotedUp,
      isVotedDown,
    } = props

    let voteIndex = 99;
    if (isVotedUp) {
      voteIndex = 0;
    }
    if (isVotedDown) {
      voteIndex = 1;
    }

    const totalVotePoints = votes ? votes.totalVotePoints : 0;

    return {
      totalCount: votes.totalCount || 0,
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
          const acceptVotePoints = stash.acceptVotes ? stash.acceptVotes.totalVotePoints : 0;
          const rejectVotePoints = stash.rejectVotes ? stash.rejectVotes.totalVotePoints : 0;
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
