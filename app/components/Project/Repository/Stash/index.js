import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Row, Col, Panel } from 'react-bootstrap';
import styled from 'styled-components';
import MainGrid from 'components/shared/MainGrid';
import StashHead from './Head';
import StashCommitStatus from './CommitStatus';
import StashComment from './StashComment';
import UserVoteList from './UserVoteList';

const PanelHead = styled(Panel)`
  padding: 15px;
  background: #f9f9f9;
  color: #777;
  border-color: #ddd;
`

const Stash = ({ stash }) => (
  <MainGrid>
    <Row>
      <Col md={9}>
        <PanelHead>
          <StashHead stashHead={stash.refStash} />
          <StashCommitStatus stashCommitStatus={stash.refStash.target} />
        </PanelHead>
        <StashComment stashComment={stash.refStash.stash} />
      </Col>
      <Col md={3}>
        <UserVoteList
          userVoteList={stash.refStash.stash.stashAcc}
          title={'Accepted by'}
        />
        <UserVoteList
          userVoteList={stash.refStash.stash.stashReject}
          title={'Rejected by'}
        />
      </Col>
    </Row>
  </MainGrid>
)

Stash.propTypes = {
  stash: PropTypes.object.isRequired,
}

export default createFragmentContainer(Stash, {
  stash: graphql`
    fragment Stash_stash on Repository {
      refStash: ref(refName: $stashNum) @include(if: $isStash)  {
        ...Head_stashHead
        stash {
          ...StashComment_stashComment
          stashAcc: acceptVotes (first: 9999) {
            ...UserVoteList_userVoteList
          }
          stashReject: rejectVotes (first: 9999) {
            ...UserVoteList_userVoteList
          }
        }
        target {
          ... on Commit {
            ...CommitStatus_stashCommitStatus
          }
        }
      }
    }
  `,
})
