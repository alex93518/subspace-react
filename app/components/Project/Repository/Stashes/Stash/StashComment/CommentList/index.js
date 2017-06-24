import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { createContainer } from 'recompose-relay'
import FlipMove from 'react-flip-move';
import styled from 'styled-components';
import CommentTree from './CommentTree';

const DivComment = styled.div`
  margin-bottom: 20px;
  text-align: center;
`

const NavDropdownButton = styled(NavDropdown)`
  border: 1px solid rgba(27,31,35,0.2);
  border-radius: 4px;
  background-color: #eff3f6;
  background-image: -webkit-linear-gradient(270deg, #fafbfc 0%, #eff3f6 90%);
  background-image: linear-gradient(-180deg, #fafbfc 0%, #eff3f6 90%);
  margin-top: 5px;
  margin-right: 5px;
  color: #777;
  font-size: 13px;
  & a {
    padding: 5px 10px !important;
  }
`

const SpanSort = styled.span`
  color: #999;
  margin-right: 5px;
`

const SpanSortContent = styled.span`
  font-weight: 700;
`

const DropdownButton = ({ title, content }) => (
  <span>
    <SpanSort>{ title }</SpanSort>
    <SpanSortContent>{ content }</SpanSortContent>
  </span>
)

DropdownButton.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}

const CommentList = ({
  commentList: { id, comments: { totalCount, edges } },
  showContent, handleSelectShowContent, handleSelectSort,
  SHOWCONTENT, SORT, sortBy, relay: { variables },
}) => (
  totalCount === 0 ? <DivComment>No comment yet</DivComment> :
  <div>
    <Navbar fluid>
      <Nav pullRight onSelect={handleSelectSort}>
        <NavDropdownButton
          title={<DropdownButton title={'Sort by:'} content={sortBy.text} />}
          id={'split-button-sort'}
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
        </NavDropdownButton>
      </Nav>
      <Nav pullRight onSelect={handleSelectShowContent}>
        <NavDropdownButton
          title={
            <DropdownButton
              title={'Show content:'}
              content={showContent.text}
            />
          }
          id={'split-button-sort'}
        >
          {
            SHOWCONTENT.map(content =>
              <MenuItem
                key={`showcontent${content.idx}`}
                eventKey={content.idx}
              >
                {content.text}
              </MenuItem>
            )
          }
        </NavDropdownButton>
      </Nav>
    </Navbar>
    <FlipMove
      duration={400}
      easing="ease"
      staggerDurationBy={15}
      staggerDelayBy={20}
      appearAnimation={'accordionVertical'}
      enterAnimation={'accordionVertical'}
      leaveAnimation={'accordionVertical'}
    >
      {
        edges.map(({ node }) => (
          <div key={node.id}>
            <div id={`stashComment-anchor-${node.rawId}`} />
            <CommentTree
              commentTree={node}
              showContent={showContent.key}
              stashGlobalId={id}
              {...variables}
            />
          </div>
        ))
      }
    </FlipMove>
  </div>
)

CommentList.propTypes = {
  commentList: PropTypes.object.isRequired,
  showContent: PropTypes.object.isRequired,
  handleSelectShowContent: PropTypes.func.isRequired,
  handleSelectSort: PropTypes.func.isRequired,
  SORT: PropTypes.array.isRequired,
  SHOWCONTENT: PropTypes.array.isRequired,
  sortBy: PropTypes.object.isRequired,
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
      commentList: vars => Relay.QL`
        fragment on Stash {
          id
          comments(first: 50, sortBy: $sort) {
            totalCount
            edges {
              node {
                ${CommentTree.getFragment('commentTree', vars)}
                id
                rawId
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
    SHOWCONTENT: [
      { idx: 0, key: 'all', text: 'All' },
      { idx: 1, key: 'upVoters', text: 'Upvoters' },
      { idx: 2, key: 'downVoters', text: 'Downvoters' },
      { idx: 3, key: 'nonVoters', text: 'Nonvoters' },
      { idx: 4, key: 'none', text: 'None' },
    ],
  })),
  withState('showContent', 'updateShowContent', props => props.SHOWCONTENT[0]),
  withState('sortBy', 'updateSortBy', props => props.SORT[0]),
  withHandlers({
    handleSelectShowContent: props => selectedKey => {
      props.updateShowContent(props.SHOWCONTENT[selectedKey])
    },
    handleSelectSort: props => selectedKey => {
      props.updateSortBy(props.SORT[selectedKey])
      props.relay.setVariables({
        sort: props.SORT[selectedKey].key,
      })
    },
  }),
)(CommentList)
