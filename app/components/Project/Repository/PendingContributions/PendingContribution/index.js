import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import moment from 'moment';
import UserPhoto from 'components/shared/UserPhoto';
import Commits from './Commits';
import Comments from './Comments';
import Votes from './Votes';
import { PendingMainGrid } from './styles';

const PendingContribution = ({
  title, pendingRef,
  // cardColor,
  pendingRef: {
    stash: { description, owner, createdAt },
  },
}) => (
  <PendingMainGrid>
    <Card>
      <CardHeader
        title={title}
        subheader={`pushed ${moment(createdAt).fromNow()}`}
        avatar={(
          <Avatar>
            <UserPhoto
              userName={owner.userName}
              photoUrl={owner.photoUrl}
              width={32}
              height={32}
            />
          </Avatar>
        )}
      />
      <CardContent>
        <Card>
          <CardContent>
            {description && (
              <dl>
                <dt>Description</dt>
                <dd>
                  {description}
                </dd>
              </dl>
            )}
            <dl>
              <dt>Goals &amp; Issues</dt>
              <dd>TODO</dd>
            </dl>
            <dl>
              <dt>Contributor Statistics</dt>
              <dd>TODO</dd>
            </dl>
          </CardContent>
        </Card>
        <Commits commit={pendingRef.target} />
        <Comments stash={pendingRef.stash} />
        <Votes stash={pendingRef.stash} />
      </CardContent>
    </Card>
  </PendingMainGrid>
)

PendingContribution.propTypes = {
  pendingRef: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  // cardColor: PropTypes.string.isRequired,
}

export default compose(
  withRelayFragment({
    pendingRef: graphql`
      fragment PendingContribution_pendingRef on Ref {
        id
        stash {
          id
          stashNum
          title
          description
          createdAt
          owner {
            userName
            photoUrl
          }
          isUserVoted
          ...Comments_stash
          ...Votes_stash
        }
        target {
          ... on Commit {
            ...Commits_commit
          }
        }
      }
    `,
  }),
  mapProps(({
    pendingRef: { stash: { stashNum, title, isUserVoted } },
    pendingRef, ...rest
  }) => {
    let cardColor = '#039BE5'
    if (isUserVoted !== null) {
      if (isUserVoted) {
        cardColor = '#43A047'
      } else {
        cardColor = '#EF5350'
      }
    }
    return {
      title: title ?
        `${title} (Stash #${stashNum})` : `Stash #${stashNum}`,
      pendingRef,
      cardColor,
      ...rest,
    }
  })
)(PendingContribution)
