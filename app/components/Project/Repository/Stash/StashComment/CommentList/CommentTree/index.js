import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose } from 'recompose';
import TreeView from 'react-treeview';
import FlipMove from 'react-flip-move';
import Comment from './Comment';
import { CommentBox } from './styles';

// Relay not allowed recursive nested object
// https://github.com/facebook/graphql/issues/91
// Set to 4 deep level comments

const TreeContent = ({
  node, lvlDeep, children, stashGlobalId, parentId, showContent,
}) => (
  <div>
    {
    node.comments.edges.length > 0 ?
      <TreeView
        key={`${lvlDeep}-${node.id}`}
        nodeLabel={(
          <Comment
            comment={node}
            isShowReply={lvlDeep < 4}
            stashGlobalId={stashGlobalId}
            parentId={parentId}
            showContent={showContent}
          />
        )}
        defaultCollapsed={false}
      >
        { children }
      </TreeView> :
      <CommentBox>
        <Comment
          comment={node}
          stashGlobalId={stashGlobalId}
          parentId={parentId}
          isShowReply={lvlDeep < 4}
          showContent={showContent}
        />
      </CommentBox>
    }
  </div>
)

TreeContent.propTypes = {
  node: PropTypes.object.isRequired,
  lvlDeep: PropTypes.number.isRequired,
  children: PropTypes.node,
  parentId: PropTypes.string,
  showContent: PropTypes.string.isRequired,
  stashGlobalId: PropTypes.string.isRequired,
}

const CommentTree = ({
  commentTree, showContent, stashGlobalId,
}) => (
  <TreeContent
    key={`commentLvl1-${commentTree.id}`}
    parentId={commentTree.rawId}
    node={commentTree}
    lvlDeep={1}
    showContent={showContent}
    stashGlobalId={stashGlobalId}
  >
    <FlipMove
      duration={400}
      easing="ease"
      staggerDurationBy={15}
      staggerDelayBy={20}
      appearAnimation={'accordionVertical'}
      enterAnimation={'accordionVertical'}
      leaveAnimation={'accordionVertical'}
    >
      {commentTree.comments.edges.map(edge2 => (
        <div key={`commentLvl2-${edge2.node.id}`}>
          <div id={`stashComment-anchor-${edge2.node.id}`} />
          <TreeContent
            parentId={edge2.node.rawId}
            node={edge2.node}
            lvlDeep={2}
            showContent={showContent}
            stashGlobalId={stashGlobalId}
          >
            <FlipMove
              duration={400}
              easing="ease"
              staggerDurationBy={15}
              staggerDelayBy={20}
              appearAnimation={'accordionVertical'}
              enterAnimation={'accordionVertical'}
              leaveAnimation={'accordionVertical'}
            >
              {edge2.node.comments.edges.map(edge3 => (
                <div key={`commentLvl3-${edge3.node.id}`}>
                  <div id={`stashComment-anchor-${edge3.node.id}`} />
                  <TreeContent
                    parentId={edge3.node.rawId}
                    node={edge3.node}
                    lvlDeep={3}
                    showContent={showContent}
                    stashGlobalId={stashGlobalId}
                  >
                    <FlipMove
                      duration={400}
                      easing="ease"
                      staggerDurationBy={15}
                      staggerDelayBy={20}
                      appearAnimation={'accordionVertical'}
                      enterAnimation={'accordionVertical'}
                      leaveAnimation={'accordionVertical'}
                    >
                      {edge3.node.comments.edges.map(edge4 => (
                        <div key={`commentLvl4-${edge4.node.id}`}>
                          <div id={`stashComment-anchor-${edge4.node.id}`} />
                          <TreeContent
                            parentId={edge4.node.rawId}
                            node={edge4.node}
                            lvlDeep={4}
                            showContent={showContent}
                            stashGlobalId={stashGlobalId}
                          >
                          </TreeContent>
                        </div>
                      ))}
                    </FlipMove>
                  </TreeContent>
                </div>
              ))}
            </FlipMove>
          </TreeContent>
        </div>
      ))}
    </FlipMove>
  </TreeContent>
)

CommentTree.propTypes = {
  commentTree: PropTypes.object.isRequired,
  showContent: PropTypes.string.isRequired,
  stashGlobalId: PropTypes.string.isRequired,
}

export default compose(
  withRelayFragment({
    commentTree: graphql`
      fragment CommentTree_commentTree on StashComment {
        id
        rawId
        createdAt
        ...Comment_comment
        comments(first: 9999, sortBy: $sort) {
          edges {
            node {
              id
              rawId
              createdAt
              ...Comment_comment
              comments(first: 9999, sortBy: $sort) {
                edges {
                  node {
                    id
                    rawId
                    createdAt
                    ...Comment_comment
                    comments(first: 9999, sortBy: $sort) {
                      edges {
                        node {
                          id
                          rawId
                          createdAt
                          ...Comment_comment
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  }),
)(CommentTree)
