import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, withState, withHandlers } from 'recompose';
import { Button } from 'react-bootstrap';
import Editor from 'react-quill';
import styled from 'styled-components';
import { Element, scroller } from 'react-scroll';
import Separator from 'components/shared/Separator';
import { addStashCommentMutation } from 'relay';
import CommentList from './CommentList';

const MainDiv = styled.div`
  margin-top: 35px;
`

const HeadSeparator = styled(Separator)`
  background: #ddd;
  margin-top: 0px;
`

const DivAddComment = styled.div`
  text-align: right;
  margin-top: 10px;
`

const StashComment = ({
  stashComment, stashComment: { totalComments: { totalAllCount } },
  submitComment, content, handleContentChange,
}) => (
  <MainDiv>
    <Element name={'commentTop'}>
      <h4>Comments ({totalAllCount || 0})</h4>
    </Element>
    <HeadSeparator />
    <CommentList commentList={stashComment} />
    <HeadSeparator />
    <h4>Leave a comment</h4>
    <Editor
      value={content}
      onChange={handleContentChange}
    />
    <DivAddComment>
      <Button onClick={submitComment}>Comment</Button>
    </DivAddComment>
  </MainDiv>
)

StashComment.propTypes = {
  stashComment: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  handleContentChange: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
}

export default compose(
  withRelayFragment({
    stashComment: graphql`
      fragment StashComment_stashComment on Stash {
        id
        rawId
        totalComments: comments {
          totalAllCount
        }
        ...CommentList_commentList
      }
    `,
  }),
  withState('content', 'updateContent', ''),
  withHandlers({
    handleContentChange: props => value => {
      props.updateContent(value);
    },
    submitComment: ({
      stashComment: { id, rawId },
      content, updateContent,
    }) => () => {
      if (content) {
        addStashCommentMutation({
          id,
          content,
          stashId: rawId || null,
          parentId: null,
          onCompleted: resp => {
            if (resp.addStashComment.clientMutationId) {
              updateContent('');
              scroller.scrollTo(
                `stashComment-anchor-${resp.addStashComment.clientMutationId}`
              );
            }
          },
        });
      }
    },
  })
)(StashComment)
