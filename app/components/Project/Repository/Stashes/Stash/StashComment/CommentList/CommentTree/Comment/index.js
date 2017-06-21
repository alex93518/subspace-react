import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { compose, withState, mapProps, lifecycle } from 'recompose';
import { createContainer } from 'recompose-relay'
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
  border: 0px;
  & .panel-heading {
    background: ${props => {
      let color = '#fcfcfc';
      if (props['data-isOwnerVoteUp'] !== null) {
        if (props['data-isOwnerVoteUp']) {
          color = 'rgba(45, 132, 48, 0.03)'
        } else {
          color = 'rgba(203, 36, 36, 0.03)'
        }
      }
      return color
    }};
    border: 1px solid ${props => {
      let color = '#ddd';
      if (props['data-isOwnerVoteUp'] !== null) {
        if (props['data-isOwnerVoteUp']) {
          color = 'rgba(45, 132, 48, 0.6)'
        } else {
          color = 'rgba(169, 12, 12, 0.36)'
        }
      }
      return color
    }};
    color: ${props => {
      let color = '#777';
      if (props['data-isOwnerVoteUp'] !== null) {
        if (props['data-isOwnerVoteUp']) {
          color = 'rgba(45, 132, 48, 1)'
        } else {
          color = 'rgba(203, 36, 36, 1)'
        }
      }
      return color
    }};
  }
  & .panel-body {
    display: ${props => props['data-isShowContent'] ? 'block' : 'none'};
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
  & .panel-footer {
    display: ${props => props['data-isShowContent'] ? 'block' : 'none'};
    border: 1px solid #ddd;
  }
`

const Comment = ({
  comment, isShowReply, stashData, parentId, isShowContent,
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
        <CommentFooter
          stashData={stashData}
          parentId={parentId}
          isShowReply={isShowReply}
          commentFooter={comment}
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
  isShowContent: PropTypes.bool.isRequired,
  updateIsShowContent: PropTypes.func.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      comment: () => Relay.QL`
        fragment on StashComment {
          ${CommentHeader.getFragment('commentHeader')}
          ${CommentFooter.getFragment('commentFooter')}
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
