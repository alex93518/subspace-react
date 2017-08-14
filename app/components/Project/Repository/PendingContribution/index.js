import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Description from './Description';
import { PendingMainGrid } from './styles';

const PendingContribution = ({ pendingContribution }) => (
  <PendingMainGrid>
    <MuiThemeProvider>
      <Description pendingRef={pendingContribution.pendingRef} />
    </MuiThemeProvider>
  </PendingMainGrid>
)

PendingContribution.propTypes = {
  pendingContribution: PropTypes.object.isRequired,
}

export default createFragmentContainer(PendingContribution, {
  pendingContribution: graphql`
    fragment PendingContribution_pendingContribution on Repository {
      pendingRef: ref(refName: $stashNum) @include(if: $isStash)  {
        ...Description_pendingRef
        stash {
          id
        }
      }
    }
  `,
})
