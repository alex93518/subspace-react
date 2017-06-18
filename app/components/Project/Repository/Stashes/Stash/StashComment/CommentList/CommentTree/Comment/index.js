import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import { LinkUserPhoto } from 'components/shared/Links';
import CommentHeader from './CommentHeader';
import CommentFooter from './CommentFooter';

const MainDiv = styled.div`
  position: relative;
  padding-left: 60px;
  flex: 1;
`

const DivLinkPhoto = styled.div`
  float: left;
  margin-left: -60px;
  border-radius: 3px;
`

const PanelComment = styled(Panel)`
  & .panel-heading {
    background: ${props => {
      let color = '#fcfcfc';
      if (props['data-isOwnerVoteUp'] !== null) {
        if (props['data-isOwnerVoteUp']) {
          color = 'rgba(45, 132, 48, 0.11)'
        } else {
          color = 'rgba(203, 36, 36, 0.08)'
        }
      }
      return color
    }};
  }
`

const Comment = ({
  comment, isShowReply, stashData, parentId,
  comment: { content, owner, isOwnerVoteUp },
}) => (
  <MainDiv>
    <DivLinkPhoto>
      <LinkUserPhoto user={owner} width={44} height={44} />
    </DivLinkPhoto>
    <PanelComment
      data-isOwnerVoteUp={isOwnerVoteUp}
      header={
        <CommentHeader commentHeader={comment} />
      }
      footer={
        <CommentFooter
          stashData={stashData}
          parentId={parentId}
          isShowReply={isShowReply}
        />
      }
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </PanelComment>
  </MainDiv>
)

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  isShowReply: PropTypes.bool.isRequired,
  stashData: PropTypes.object.isRequired,
  parentId: PropTypes.string,
}

export default Relay.createContainer(Comment, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    comment: () => Relay.QL`
      fragment on StashComment {
        ${CommentHeader.getFragment('commentHeader')}
        id
        owner {
          ${LinkUserPhoto.getFragment('user')}
        }
        isOwnerVoteUp
        content
        createdAt
      }
    `,
  },
})
