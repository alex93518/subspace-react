import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, withState, mapProps, lifecycle } from 'recompose';
import FlipMove from 'react-flip-move';
import { LinkUserPhoto } from 'components/shared/Links';
import CommentHeader from './CommentHeader';
import CommentFooter from './CommentFooter';
import { MainDiv, DivLinkPhoto, PanelComment } from './styles';

const Comment = ({
  stashComment, isShowReply, parentId, isShowContent, stashGlobalId,
  updateIsShowContent, stashComment: { content, owner, isOwnerVoteUp },
}) => (
  <MainDiv>
    <DivLinkPhoto>
      <LinkUserPhoto user={owner} width={32} height={32} />
    </DivLinkPhoto>
    <PanelComment
      data-isOwnerVoteUp={isOwnerVoteUp}
      data-isShowContent={isShowContent}
      header={
        <CommentHeader
          stashComment={stashComment}
          isShowContent={isShowContent}
          updateIsShowContent={updateIsShowContent}
        />
      }
      footer={
        isShowContent &&
        <FlipMove
          duration={150}
          easing="ease"
          staggerDurationBy={15}
          staggerDelayBy={20}
          enterAnimation={'accordionVertical'}
          leaveAnimation={'accordionVertical'}
        >
          {
            isShowContent &&
            <div key={`comment-footer-${stashComment.id}`}>
              <CommentFooter
                parentId={parentId}
                isShowReply={isShowReply}
                stashComment={stashComment}
                stashGlobalId={stashGlobalId}
              />
            </div>
          }
        </FlipMove>
      }
    >
      <FlipMove
        duration={150}
        easing="ease"
        staggerDurationBy={15}
        staggerDelayBy={20}
        enterAnimation={'accordionVertical'}
        leaveAnimation={'accordionVertical'}
      >
        {
          isShowContent &&
          <div key={`comment-content-${stashComment.id}`}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        }
      </FlipMove>
    </PanelComment>
  </MainDiv>
)

Comment.propTypes = {
  stashComment: PropTypes.object.isRequired,
  isShowReply: PropTypes.bool.isRequired,
  parentId: PropTypes.string,
  isShowContent: PropTypes.bool.isRequired,
  updateIsShowContent: PropTypes.func.isRequired,
  stashGlobalId: PropTypes.string.isRequired,
}

export default compose(
  withRelayFragment({
    stashComment: graphql`
      fragment Comment_stashComment on StashComment {
        ...CommentHeader_stashComment
        ...CommentFooter_stashComment
        id
        owner {
          userName
          photoUrl
        }
        isOwnerVoteUp
        content
        createdAt
      }
    `,
  }),
  mapProps(props => {
    let isShowCommentContent = true;
    if (
      props.showContent === 'upVoters' &&
      props.stashComment.isOwnerVoteUp !== true
    ) {
      isShowCommentContent = false
    }
    if (
      props.showContent === 'downVoters' &&
      (
        props.stashComment.isOwnerVoteUp === null ||
        props.stashComment.isOwnerVoteUp !== false
      )
    ) {
      isShowCommentContent = false
    }
    if (
      props.showContent === 'nonVoters' &&
      props.stashComment.isOwnerVoteUp !== null
    ) {
      isShowCommentContent = false
    }
    if (props.showContent === 'none') {
      isShowCommentContent = false
    }
    return {
      isShowCommentContent,
      ...props,
    }
  }),
  withState('isShowContent', 'updateIsShowContent',
    props => props.isShowCommentContent
  ),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (nextProps.isShowCommentContent !== this.props.isShowCommentContent) {
        nextProps.updateIsShowContent(nextProps.isShowCommentContent)
      }
    },
  })
)(Comment)
