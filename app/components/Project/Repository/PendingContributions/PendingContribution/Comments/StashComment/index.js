import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, withState, withHandlers } from 'recompose';
import { Button } from 'react-bootstrap';
import { Element, scroller } from 'react-scroll';
import { addStashCommentMutation } from 'relay';
import Editor from 'react-quill';
// import Editor from './components/Editor'
import CommentList from './CommentList';
import { HeadSeparator, DivAddComment } from './styles';

const StashComment = ({
  stash, submitComment, content, handleContentChange,
}) => (
  <div>
    <Element name={'commentTop'} />
    <CommentList stash={stash} stashNum={stash.stashNum} />
    <HeadSeparator />
    <h4>Leave a comment</h4>
    <Editor
      value={content}
      onChange={handleContentChange}
    />
    <DivAddComment>
      <Button onClick={submitComment}>Comment</Button>
    </DivAddComment>
  </div>
)

StashComment.propTypes = {
  stash: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  handleContentChange: PropTypes.func.isRequired,
  submitComment: PropTypes.func.isRequired,
}

export default compose(
  withRelayFragment({
    stash: graphql`
      fragment StashComment_stash on Stash {
        id
        rawId
        stashNum
        ...CommentList_stash
      }
    `,
  }),
  withState('content', 'updateContent', ''),
  withHandlers({
    handleContentChange: props => value => {
      props.updateContent(value);
    },
    submitComment: ({
      stash: { id, rawId },
      content, updateContent,
    }) => () => {
      if (content) {
        addStashCommentMutation({
          id,
          content,
          stashId: rawId || null,
          parentId: null,
          sort: 'popular',
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
