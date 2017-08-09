import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { compose, withState, withHandlers } from 'recompose';
import FlipMove from 'react-flip-move';
import withRelayFragment from 'relay/withRelayFragment';
import StashCommitStatus from 'components/Project/Repository/Stash/CommitStatus';
import Header from './Header';
import Footer from './Footer';
import Form from './Form';
import { PendingStashPanel, ContentDiv, CommitDiv } from './styles';

const PendingStashItem = ({
  gitRef, isShowContent, toggleShowContent, isClear,
  // handleSubmit, pristine, reset, submitting,
}) => (
  <PendingStashPanel
    header={
      <Header
        pendingStashItem={gitRef}
        isShowContent={isShowContent}
        toggleShowContent={toggleShowContent}
        isClear={isClear}
      />
    }
    footer={
      isShowContent &&
      <Footer pendingStashItem={gitRef} />
    }
  >
    <FlipMove
      duration={100}
      easing="ease"
      staggerDurationBy={10}
      staggerDelayBy={15}
      enterAnimation={'accordionVertical'}
      leaveAnimation={'accordionVertical'}
    >
      {
        isShowContent &&
        <div key={`reviewPendingPushContent${gitRef.id}`}>
          <ContentDiv>
            <Form formId={gitRef.id} stashId={gitRef.stash.rawId} />
            <CommitDiv>
              <StashCommitStatus stashCommitStatus={gitRef.target} />
            </CommitDiv>
          </ContentDiv>
        </div>
      }
    </FlipMove>
  </PendingStashPanel>
)

PendingStashItem.propTypes = {
  gitRef: PropTypes.object.isRequired,
  isShowContent: PropTypes.bool.isRequired,
  toggleShowContent: PropTypes.func.isRequired,
  isClear: PropTypes.bool.isRequired,
}

export default compose(
  withRelayFragment({
    gitRef: graphql`
      fragment PendingStashItem_gitRef on Ref {
        ...Header_pendingStashItem
        ...Footer_pendingStashItem
        repository {
          name
        }
        stash {
          rawId
        }
        id
        name
        target {
          ... on Commit {
            ...CommitStatus_stashCommitStatus
          }
        }      
      }
    `,
  }),
  withState('isShowContent', 'updateIsShowContent', false),
  withState('isClear', 'updateIsClear', false),
  withHandlers({
    toggleShowContent: props => () => {
      props.updateIsShowContent(!props.isShowContent)
    },
  })
)(PendingStashItem)
