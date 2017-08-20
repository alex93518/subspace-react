import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { SpanUser, UserPhoto, UserName, SpanPoint } from './styles';

const UserVoteList = ({ stashVoteConnection, title }) => (
  <dl>
    <dt>
      {title}
    </dt>
    <dd>
      {
      stashVoteConnection.totalCount < 1 ?
        'None yet' :
        stashVoteConnection.edges.map(({ node }) => (
          <SpanUser key={node.id}>
            <UserPhoto
              width={20}
              height={20}
              user={node.owner}
            />
            <UserName userName={node.owner.userName} />
            <SpanPoint
              data-votePoint={node.isVoteUp ? node.votePoint : -node.votePoint}
            >
              {node.isVoteUp ? node.votePoint : -node.votePoint}
            </SpanPoint>
          </SpanUser>
        ))
      }
    </dd>
  </dl>
)

UserVoteList.propTypes = {
  title: PropTypes.string.isRequired,
  stashVoteConnection: PropTypes.object.isRequired,
};

export default createFragmentContainer(UserVoteList, {
  stashVoteConnection: graphql`
    fragment UserVoteList_stashVoteConnection on StashVoteConnection {
      totalCount
      edges {
        node {
          id
          votePoint
          isVoteUp
          owner {
            userName
            photoUrl
          }
        }
      }
    }
  `,
})
