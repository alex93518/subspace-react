import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayRefetch from 'relay/withRelayRefetch';
import { Navbar, Nav, MenuItem } from 'react-bootstrap';
import { compose, withState, withHandlers, mapProps } from 'recompose';
import { Element } from 'react-scroll';
import FlipMove from 'react-flip-move';
import CommentTree from './CommentTree';
import { SpanSort, SpanSortContent, DivComment, NavDropdownButton } from './styles';

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
  stash: { id, comments: { totalCount, edges } },
  showContent, handleSelectShowContent, handleSelectSort,
  SHOWCONTENT, SORT, sortBy,
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
              (<MenuItem
                key={`splitcontent${sort.idx}`}
                eventKey={sort.idx}
              >
                {sort.text}
              </MenuItem>)
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
              (<MenuItem
                key={`showcontent${content.idx}`}
                eventKey={content.idx}
              >
                {content.text}
              </MenuItem>)
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
      enterAnimation={'accordionVertical'}
      leaveAnimation={'accordionVertical'}
    >
      {
        edges.map(({ node }) => (
          <div key={node.id}>
            <Element name={`stashComment-anchor-${node.rawId}`} />
            <CommentTree
              stashComment={node}
              showContent={showContent.key}
              stashGlobalId={id}
            />
          </div>
        ))
      }
    </FlipMove>
  </div>
)

CommentList.propTypes = {
  stash: PropTypes.object.isRequired,
  showContent: PropTypes.object.isRequired,
  handleSelectShowContent: PropTypes.func.isRequired,
  handleSelectSort: PropTypes.func.isRequired,
  SORT: PropTypes.array.isRequired,
  SHOWCONTENT: PropTypes.array.isRequired,
  sortBy: PropTypes.object.isRequired,
}

export default compose(
  withRelayRefetch({
    stash: graphql`
      fragment CommentList_stash on Stash {
        id
        comments(first: 9999, sortBy: $sort) {
          totalCount
          edges {
            node {
              id
              rawId
              createdAt
              ...CommentTree_stashComment
            }
          }
        }
      }
    `,
  },
  graphql`
    query CommentListQuery(
      $userName: String!, $projectName: String!, $sort: String!,
      $stashName: String!, $isStashes: Boolean!
    ) {
      viewer {
        repository(ownerName: $userName, name: $projectName) {
          refStash: ref(refName: $stashName) @include(if: $isStashes)  {
            stash {
              ...CommentList_stash
            }
          }
        }
      }
    }
  `
  ),
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
      props.updateShowContent(props.SHOWCONTENT[selectedKey]);
    },
    handleSelectSort: props => selectedKey => {
      props.updateSortBy(props.SORT[selectedKey]);
      const stashName = `stash-${props.stashNum}`
      const refetchVariables = () => ({
        sort: props.SORT[selectedKey].key,
        stashName,
      });
      props.relay.refetch(refetchVariables, null);
    },
  }),
)(CommentList)
