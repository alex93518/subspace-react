import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { compose } from 'recompose';
import withRelayFragment from 'relay/withRelayFragment';
import StashCommitStatus from 'components/Project/Repository/Stash/CommitStatus';
import { reduxForm } from 'redux-form/immutable';
import Header from './Header';
import Footer from './Footer';
import { PendingStashPanel } from './styles';

const PendingStashItem = ({
  gitRef,
}) => (
  <PendingStashPanel
    header={<Header pendingStashItem={gitRef} />}
    footer={<Footer pendingStashItem={gitRef} />}
  >
    <StashCommitStatus stashCommitStatus={gitRef.target} />
  </PendingStashPanel>
)

PendingStashItem.propTypes = {
  gitRef: PropTypes.object.isRequired,
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
  reduxForm({
    form: 'updateStash',
  })
)(PendingStashItem)
