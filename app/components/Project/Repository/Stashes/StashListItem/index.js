import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { Row, Col, Panel, Media } from 'react-bootstrap';
import styled from 'styled-components';
import { compose, mapProps } from 'recompose';
import CircularProgressbar from 'react-circular-progressbar';
import { LinkUserName, LinkProject, LinkStash } from 'components/shared/Links';
import FaCommentO from 'react-icons/lib/fa/comment-o';
import Separator from 'components/shared/Separator';

const PanelHead = styled(Panel)`
  padding: 15px;
  background: #f9f9f9;
  color: #777;
  border-color: #ddd;
`

const H2Head = styled.h2`
  display: inline;
  margin-top: 0px;
  margin-right: -10px;
`

const SpanStashNum = styled.span`
  margin-right: 20px;
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

const RowVoteStats = styled(Row)`
  margin-top: 10px;
`

const NumberDiv = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #777;
`

const SpanAcceptPoint = styled.span`
  font-weight: 700;
  color: #2cbe4e;
`

const SpanRejectPoint = styled.span`
  font-weight: 700;
  color: #cb2431;
`

const ProgressContainer = styled.div`
  height: 50px;
  width: 50px;
`

const ProgressBody = styled(Media.Body)`
  padding-left: 10px;
`

const CommentSeparator = styled(Separator)`
  margin-bottom: 10px;
`

const CommentIcon = styled(FaCommentO)`
  vertical-align: text-top !important;
  margin-right: 7px;
`

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
