import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, withState, mapProps, lifecycle } from 'recompose';
import styled, { keyframes } from 'styled-components';
import { Panel } from 'react-bootstrap';
import FlipMove from 'react-flip-move';
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

const PaddingKeyframes = isShowContent => keyframes`
  from {
    padding-top: ${isShowContent ? '0' : '15'}px;
    padding-bottom: ${isShowContent ? '0' : '15'}px;
  }
  to {
    padding-top: ${isShowContent ? '15' : '0'}px;
    padding-bottom: ${isShowContent ? '15' : '0'}px;
  }
`

const PanelComment = styled(Panel)`
  border: 0px;
  & .panel-heading {
    background: #fcfcfc;
    color: #777;
    border: 1px solid ${props => {
      let color = '#ddd';
      if (props['data-isOwnerVoteUp'] !== null) {
        if (props['data-isOwnerVoteUp']) {
          color = 'rgba(45, 132, 48, 0.6)'
        } else {
          color = 'rgba(169, 12, 12, 0.6)'
        }
      }
      return color
    }};
    border-left: ${props => {
      let border = '1px solid #ddd'
      if (props['data-isOwnerVoteUp'] !== null) {
        if (props['data-isOwnerVoteUp']) {
          border = '6px solid rgba(45, 132, 48, 0.6)'
        } else {
          border = '6px solid rgba(169, 12, 12, 0.6)'
        }
      }
      return border
    }};
  }
  & .panel-body {
    -webkit-animation: ${props => PaddingKeyframes(props['data-isShowContent'])} 0.3s; /* Safari 4+ */
    -moz-animation:    ${props => PaddingKeyframes(props['data-isShowContent'])} 0.3s; /* Fx 5+ */
    -o-animation:      ${props => PaddingKeyframes(props['data-isShowContent'])} 0.3s; /* Opera 12+ */
    animation:         ${props => PaddingKeyframes(props['data-isShowContent'])} 0.3s; /* IE 10+, Fx 29+ */
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding-top: ${props => props['data-isShowContent'] ? '15' : '0'}px;
    padding-bottom: ${props => props['data-isShowContent'] ? '15' : '0'}px;
  }
  & .panel-footer {
    border: 1px solid #ddd;
  }
`

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
          appearAnimation={'accordionVertical'}
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
        appearAnimation={'accordionVertical'}
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
