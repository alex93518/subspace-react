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
  comment, isShowReply, parentId, isShowContent, stashGlobalId,
  updateIsShowContent, comment: { content, owner, isOwnerVoteUp },
}) => (
  <MainDiv>
    <DivLinkPhoto>
      <LinkUserPhoto user={owner} width={40} height={40} />
    </DivLinkPhoto>
    <PanelComment
      data-isOwnerVoteUp={isOwnerVoteUp}
      data-isShowContent={isShowContent}
      header={
        <CommentHeader
          commentHeader={comment}
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
            <div key={`comment-footer-${comment.id}`}>
              <CommentFooter
                parentId={parentId}
                isShowReply={isShowReply}
                commentFooter={comment}
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
          <div key={`comment-content-${comment.id}`}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        }
      </FlipMove>
    </PanelComment>
  </MainDiv>
)

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  isShowReply: PropTypes.bool.isRequired,
  parentId: PropTypes.string,
  isShowContent: PropTypes.bool.isRequired,
  updateIsShowContent: PropTypes.func.isRequired,
  stashGlobalId: PropTypes.string.isRequired,
}

export default compose(
  withRelayFragment({
    comment: graphql`
      fragment Comment_comment on StashComment {
        ...CommentHeader_commentHeader
        ...CommentFooter_commentFooter
        id
        owner {
          ...LinkUserPhoto_user
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
      props.comment.isOwnerVoteUp !== true
    ) {
      isShowCommentContent = false
    }
    if (
      props.showContent === 'downVoters' &&
      (
        props.comment.isOwnerVoteUp === null ||
        props.comment.isOwnerVoteUp !== false
      )
    ) {
      isShowCommentContent = false
    }
    if (
      props.showContent === 'nonVoters' &&
      props.comment.isOwnerVoteUp !== null
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
