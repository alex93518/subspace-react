import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { LinkUserName, LinkUserPhoto } from 'components/shared/Links'
import Separator from 'components/shared/Separator';

const DivTitle = styled.div`
  color: #586069;
  line-height: 16px;
  font-weight: 600;
  padding: 5px 0;
  margin-bottom: 10px;
`

const UserPhoto = styled(LinkUserPhoto)`
  margin-right: 7px;
`

const SpanPoint = styled.span`
  margin-left: 5px;
  color: ${props => props['data-votePoint'] > 0 ? '#2cbe4e' : '#cb2431'};
`

const DivUser = styled.div`
  margin: 10px 0;
`

const UserVoteList = ({ userVoteList, title }) => (
  <div>
    <DivTitle>
      {title}
    </DivTitle>
    {
      userVoteList.totalCount < 1 ?
        <div>None yet</div> :
        userVoteList.edges.map(({ node }) =>
          <DivUser key={node.id}>
            <UserPhoto
              width={20}
              height={20}
              user={node.owner}
            />
            <LinkUserName user={node.owner} />
            <SpanPoint
              data-votePoint={node.isVoteUp ? node.votePoint : -node.votePoint}
            >
              {node.isVoteUp ? node.votePoint : -node.votePoint}
            </SpanPoint>
          </DivUser>
        )
    }
    <Separator />
  </div>
)

UserVoteList.propTypes = {
  title: PropTypes.string.isRequired,
  userVoteList: PropTypes.object.isRequired,
}

export default Relay.createContainer(UserVoteList, {
  fragments: {
    userVoteList: () => Relay.QL`
      fragment on StashVoteConnection {
        totalCount
        edges {
          node {
            id
            votePoint
            isVoteUp
            owner {
              ${LinkUserName.getFragment('user')}
              ${LinkUserPhoto.getFragment('user')}
            }
          }
        }
      }
    `,
  },
})
