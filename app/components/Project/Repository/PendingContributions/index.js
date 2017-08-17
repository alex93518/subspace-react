import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import RepositoryQueryRenderer from 'relay/RepositoryQueryRenderer';
import MainGrid from 'components/shared/MainGrid';
import PendingContribution from './PendingContribution';

const Stashes = ({
  repository: { stashes: { edges } },
}) => (
  <MainGrid>
    <div>
      {
        edges && edges.map(({ node, node: { id } }) =>
          <PendingContribution key={id} pendingRef={node} />
        )
      }
    </div>
  </MainGrid>
)

Stashes.propTypes = {
  repository: PropTypes.object,
}

const PendingContributions = ({ vars }) => (
  <RepositoryQueryRenderer vars={vars} query={query}>
    <Stashes />
  </RepositoryQueryRenderer>
)

PendingContributions.propTypes = {
  vars: PropTypes.object.isRequired,
};

const query = graphql`
  query PendingContributionsQuery(
    $userName: String!, $projectName: String!, $sort: String!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        stashes(first: 99){
          edges {
            node {
              id
              ...PendingContribution_pendingRef
            }
          }
        }
      }
    }
  }
`;

export default PendingContributions;
