import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { LinkUserName } from 'components/shared/Links';
import Separator from 'components/shared/Separator';
import { DivTitle, DivUser, UserPhoto, SpanPoint } from './styles';

const UserVoteList = ({ userVoteList, title }) => (
  <div>
    <DivTitle>
      {title}
    </DivTitle>
    {
      userVoteList.totalCount < 1 ?
        <div>None yet</div> :
        userVoteList.edges.map(({ node }) =>
          (<DivUser key={node.id}>
            <UserPhoto
              width={20}
              height={20}
              user={node.owner}
            />
            <LinkUserName userName={node.owner.userName} />
            <SpanPoint
              data-votePoint={node.isVoteUp ? node.votePoint : -node.votePoint}
            >
              {node.isVoteUp ? node.votePoint : -node.votePoint}
            </SpanPoint>
          </DivUser>)
        )
    }
    <Separator />
  </div>
)

UserVoteList.propTypes = {
  title: PropTypes.string.isRequired,
  userVoteList: PropTypes.object.isRequired,
};

export default createFragmentContainer(UserVoteList, {
  userVoteList: graphql`
    fragment UserVoteList_userVoteList on StashVoteConnection {
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
