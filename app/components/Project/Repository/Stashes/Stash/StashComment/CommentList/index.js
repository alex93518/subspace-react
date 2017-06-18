import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import styled from 'styled-components';
import R from 'ramda';
import CommentTree from './CommentTree';

const DivComment = styled.div`
  margin-bottom: 20px;
  text-align: center;
`

const createdAtSort = R.sortBy(R.path(['node', 'createdAt']))

const CommentList = ({
  commentList: { comments: { totalCount, edges } }, stashData,
}) => (
  totalCount === 0 ? <DivComment>No comment yet</DivComment> :
  <div>
    <Navbar fluid>
      <Nav>
        <NavItem>All</NavItem>
        <NavItem>Upvoters</NavItem>
        <NavItem>Downvoters</NavItem>
      </Nav>
      <Nav pullRight>
        <NavItem>Authors</NavItem>
        <NavItem>Sort</NavItem>
      </Nav>
    </Navbar>
    {
      createdAtSort(edges).reverse().map(({ node }) => (
        <CommentTree
          key={node.id}
          commentTree={node}
          stashData={stashData}
        />
      ))
    }
  </div>
)

CommentList.propTypes = {
  commentList: PropTypes.object.isRequired,
  stashData: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommentList, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    commentList: () => Relay.QL`
      fragment on Stash {
        comments(first: 50) {
          totalCount
          edges {
            node {
              ${CommentTree.getFragment('commentTree')}
              id
              createdAt
            }
          }
        }
      }
    `,
  },
})
