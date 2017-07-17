import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay';
import styled from 'styled-components';
import { compose } from 'recompose';
import TreeView from 'react-treeview';
import FlipMove from 'react-flip-move';
import Comment from './Comment'

// Relay not allowed recursive nested object
// https://github.com/facebook/graphql/issues/91
// Set to 4 deep level comments

const CommentBox = styled.div`
  margin-left: 30px;
`

const TreeContent = ({
  node, lvlDeep, children, stashGlobalId, parentId, showContent, variables,
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
            {...variables}
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
          {...variables}
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
  variables: PropTypes.object.isRequired,
}

const CommentTree = ({
  commentTree, showContent, stashGlobalId, relay: { variables },
}) => (
  <TreeContent
    key={`commentLvl1-${commentTree.id}`}
    parentId={commentTree.rawId}
    node={commentTree}
    lvlDeep={1}
    showContent={showContent}
    stashGlobalId={stashGlobalId}
    variables={variables}
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
          <div id={`stashComment-anchor-${edge2.node.rawId}`} />
          <TreeContent
            parentId={edge2.node.rawId}
            node={edge2.node}
            lvlDeep={2}
            showContent={showContent}
            stashGlobalId={stashGlobalId}
            variables={variables}
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
                  <div id={`stashComment-anchor-${edge3.node.rawId}`} />
                  <TreeContent
                    parentId={edge3.node.rawId}
                    node={edge3.node}
                    lvlDeep={3}
                    showContent={showContent}
                    stashGlobalId={stashGlobalId}
                    variables={variables}
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
                          <div id={`stashComment-anchor-${edge4.node.rawId}`} />
                          <TreeContent
                            parentId={edge4.node.rawId}
                            node={edge4.node}
                            lvlDeep={4}
                            showContent={showContent}
                            stashGlobalId={stashGlobalId}
                            variables={variables}
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
  relay: PropTypes.object.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
      sort: 'popular',
    },
    fragments: {
      commentTree: vars => Relay.QL`
        fragment on StashComment {
          id
          rawId
          createdAt
          ${Comment.getFragment('comment', vars)}
          comments(first: 9999, sortBy: $sort) {
            edges {
              node {
                id
                rawId
                createdAt
                ${Comment.getFragment('comment', vars)}
                comments(first: 9999, sortBy: $sort) {
                  edges {
                    node {
                      id
                      rawId
                      createdAt
                      ${Comment.getFragment('comment', vars)}
                      comments(first: 9999, sortBy: $sort) {
                        edges {
                          node {
                            id
                            rawId
                            createdAt
                            ${Comment.getFragment('comment', vars)}
                            comments(first: 9999, sortBy: $sort) {
                              edges
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
        }
      `,
    },
  }),
)(CommentTree)
