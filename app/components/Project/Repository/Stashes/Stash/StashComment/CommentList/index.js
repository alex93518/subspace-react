import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { createContainer } from 'recompose-relay'
import styled from 'styled-components';
import R from 'ramda';
import CommentTree from './CommentTree';

const DivComment = styled.div`
  margin-bottom: 20px;
  text-align: center;
`

const NavSort = styled(NavItem)`
  a {
    padding-right: 0px !important;
    color: #aaa !important;
  }
`

const CommentList = ({
  commentList: { comments: { totalCount, edges } },
  stashData, showContent, handleSelectShowContent, handleSelectSort,
  SORT, sortBy, createdAtSort,
}) => (
  totalCount === 0 ? <DivComment>No comment yet</DivComment> :
  <div>
    <Navbar fluid>
      <Nav
        activeKey={showContent}
        onSelect={handleSelectShowContent}
      >
        <NavItem eventKey={'all'}>Show All</NavItem>
        <NavItem eventKey={'upVoters'}>Upvoters</NavItem>
        <NavItem eventKey={'downVoters'}>Downvoters</NavItem>
        <NavItem eventKey={'nonVoters'}>Nonvoters</NavItem>
        <NavItem eventKey={'none'}>Hide All</NavItem>
      </Nav>
      <Nav pullRight onSelect={handleSelectSort}>
        <NavSort disabled>Sort by :</NavSort>
        <NavDropdown
          title={`${sortBy.text}`}
          id={'split-button'}
        >
          {
            SORT.map(sort =>
              <MenuItem
                key={`splitcontent${sort.idx}`}
                eventKey={sort.idx}
              >
                {sort.text}
              </MenuItem>
            )
          }
        </NavDropdown>
      </Nav>
    </Navbar>
    {
      createdAtSort(edges).reverse().map(({ node }) => (
        <CommentTree
          key={node.id}
          commentTree={node}
          stashData={stashData}
          showContent={showContent}
        />
      ))
    }
  </div>
)

CommentList.propTypes = {
  commentList: PropTypes.object.isRequired,
  stashData: PropTypes.object.isRequired,
  showContent: PropTypes.string.isRequired,
  handleSelectShowContent: PropTypes.func.isRequired,
  handleSelectSort: PropTypes.func.isRequired,
  SORT: PropTypes.array.isRequired,
  sortBy: PropTypes.object.isRequired,
  createdAtSort: PropTypes.func.isRequired,
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
      commentList: () => Relay.QL`
        fragment on Stash {
          comments(first: 50, sortBy: $sort) {
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
  }),
  mapProps(props => ({
    ...props,
    SORT: [
      { idx: 0, key: 'popular', text: 'Most popular' },
      { idx: 1, key: 'vote', text: 'Most vote points' },
      { idx: 2, key: 'newest', text: 'Newest first' },
      { idx: 3, key: 'oldest', text: 'Oldest first' },
    ],
    createdAtSort: R.sortBy(R.path(['node', 'createdAt'])),
  })),
  withState('showContent', 'updateShowContent', 'all'),
  withState('sortBy', 'updateSortBy', props => props.SORT[0]),
  withHandlers({
    handleSelectShowContent: props => selectedKey => {
      props.updateShowContent(selectedKey)
    },
    handleSelectSort: props => selectedKey => {
      props.updateSortBy(props.SORT[selectedKey])
      props.relay.setVariables({
        sort: props.SORT[selectedKey].key,
      })
    },
  })
)(CommentList)
