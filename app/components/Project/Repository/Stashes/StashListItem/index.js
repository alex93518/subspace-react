import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { Row, Col, Media } from 'react-bootstrap';
import { compose, mapProps } from 'recompose';
import CircularProgressbar from 'react-circular-progressbar';
import { LinkUserName, LinkProject, LinkStash } from 'components/shared/Links';
import {
  PanelHead, H2Head, SpanStashNum, StashLabel, RowVoteStats,
  ProgressContainer, ProgressBody, NumberDiv, SpanAcceptPoint,
  SpanRejectPoint, CommentSeparator, CommentIcon,
} from './styles'

const StashListItem = ({
  user, stashNum, totalCommit, totalComments,
  totalVotePoints, voteTreshold, acceptVotes, rejectVotes, votePercentage,
}) => (
  <Row>
    <Col md={12}>
      <PanelHead>
        <LinkStash to={stashNum}>
          <H2Head>
            <SpanStashNum>Stash #{stashNum}</SpanStashNum>
          </H2Head>
        </LinkStash>
        <span>
          <LinkUserName user={user} /> wants to push {totalCommit} commits into
          {' '}
          <LinkProject to={'master'}>
            <StashLabel>master</StashLabel>
          </LinkProject>
        </span>
        <RowVoteStats>
          <Col md={12}>
            <Media>
              <Media.Left align="middle">
                <LinkStash to={stashNum}>
                  <ProgressContainer>
                    <CircularProgressbar percentage={votePercentage} />
                  </ProgressContainer>
                </LinkStash>
              </Media.Left>
              <ProgressBody>
                <NumberDiv>
                  { totalVotePoints || '0' } of { voteTreshold }
                </NumberDiv>
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
              </ProgressBody>
            </Media>
            <CommentSeparator />
            <LinkStash to={stashNum}>
              <CommentIcon />
              <span>{totalComments} Comments</span>
            </LinkStash>
          </Col>
        </RowVoteStats>
      </PanelHead>
    </Col>
  </Row>
)

StashListItem.propTypes = {
  user: PropTypes.object.isRequired,
  stashNum: PropTypes.string.isRequired,
  totalCommit: PropTypes.number.isRequired,
  totalVotePoints: PropTypes.number.isRequired,
  voteTreshold: PropTypes.number.isRequired,
  acceptVotes: PropTypes.object.isRequired,
  rejectVotes: PropTypes.object.isRequired,
  totalComments: PropTypes.number.isRequired,
  votePercentage: PropTypes.number.isRequired,
}

export default compose(
  withRelayFragment({
    stashListItem: graphql`
      fragment StashListItem_stashListItem on Ref {
        stash {
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
          comments {
            totalAllCount
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
    stashListItem: {
      stash: {
        votes: {
          totalVotePoints,
        },
        acceptVotes,
        rejectVotes,
        voteTreshold,
        stashNum,
        comments: {
          totalAllCount,
        },
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
    stashNum: stashNum.toString(),
    user,
    voteTreshold,
    acceptVotes,
    rejectVotes,
    votePercentage: totalVotePoints <= 0 ? 0 :
      Math.round((totalVotePoints / voteTreshold) * 100),
    totalComments: totalAllCount || 0,
    ...rest,
  })),
)(StashListItem)
