import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay';
import styled from 'styled-components';
import { compose } from 'recompose';
import R from 'ramda';
import TreeView from 'react-treeview';
import Comment from './Comment'

// Relay not allowed recursive nested object
// https://github.com/facebook/graphql/issues/91
// Set to 4 deep level comments

const createdAtSort = R.sortBy(R.path(['node', 'createdAt']))

const CommentBox = styled.div`
  margin-left: 35px;
`

const TreeContent = ({
  node, lvlDeep, children, stashData, parentId, showContent,
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
            stashData={stashData}
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
          stashData={stashData}
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
  stashData: PropTypes.object.isRequired,
  parentId: PropTypes.string,
  showContent: PropTypes.string.isRequired,
}

const CommentTree = ({ commentTree, stashData, showContent }) => (
  <TreeContent
    key={`commentLvl1-${commentTree.id}`}
    stashData={stashData}
    parentId={commentTree.rawId}
    node={commentTree}
    lvlDeep={1}
    showContent={showContent}
  >
    {createdAtSort(commentTree.comments.edges).reverse().map(edge2 => (
      <TreeContent
        key={`commentLvl2-${edge2.node.id}`}
        stashData={stashData}
        parentId={edge2.node.rawId}
        node={edge2.node}
        lvlDeep={2}
        showContent={showContent}
      >
        {createdAtSort(edge2.node.comments.edges).reverse().map(edge3 => (
          <TreeContent
            key={`commentLvl3-${edge3.node.id}`}
            stashData={stashData}
            parentId={edge3.node.rawId}
            node={edge3.node}
            lvlDeep={3}
            showContent={showContent}
          >
            {createdAtSort(edge3.node.comments.edges).reverse().map(edge4 => (
              <TreeContent
                key={`commentLvl4-${edge4.node.id}`}
                stashData={stashData}
                parentId={edge4.node.rawId}
                node={edge4.node}
                lvlDeep={4}
                showContent={showContent}
              >
              </TreeContent>
            ))}
          </TreeContent>
        ))}
      </TreeContent>
    ))}
  </TreeContent>
)

CommentTree.propTypes = {
  commentTree: PropTypes.object.isRequired,
  stashData: PropTypes.object.isRequired,
  showContent: PropTypes.string.isRequired,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
    },
    fragments: {
      commentTree: () => Relay.QL`
        fragment on StashComment {
          id
          rawId
          createdAt
          ${Comment.getFragment('comment')}
          comments(first: 9999) {
            edges {
              node {
                id
                rawId
                createdAt
                ${Comment.getFragment('comment')}
                comments(first: 9999) {
                  edges {
                    node {
                      id
                      rawId
                      createdAt
                      ${Comment.getFragment('comment')}
                      comments(first: 9999) {
                        edges {
                          node {
                            id
                            rawId
                            createdAt
                            ${Comment.getFragment('comment')}
                            comments(first: 9999) {
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
