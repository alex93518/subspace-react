import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import RepositoryQueryRenderer from 'relay/RepositoryQueryRenderer';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import MainGrid from 'components/shared/MainGrid';
import { matchRoute } from 'utils/routeMatcher';
import CommitList from './CommitList';
import { DivCommits } from './styles';

const CommitsChildBase = ({
  repository: {
    ref: {
      target,
    },
  },
  repository, splat,
}) => (
  <MainGrid>
    <DivCommits>
      <BranchSelect
        repository={repository}
        suffix={`commits${splat ? `/${splat}` : ''}`}
      />
      <CommitList commit={target} />
    </DivCommits>
  </MainGrid>
)

CommitsChildBase.propTypes = {
  repository: PropTypes.object,
  splat: PropTypes.string,
};

const CommitsChild = compose(
  withRouter,
  mapProps(({
    location: { pathname },
    ...rest
  }) => ({
    splat: matchRoute(pathname).params['0'] || null,
    ...rest,
  }))
)(CommitsChildBase);

const Commits = ({ vars }) => (
  <RepositoryQueryRenderer vars={vars} query={query}>
    <CommitsChild />
  </RepositoryQueryRenderer>
)

Commits.propTypes = {
  vars: PropTypes.object.isRequired,
};

const query = graphql`
  query CommitsQuery(
    $userName: String!, $projectName: String!,
    $branchHead: String!, $splat: String, $isStashes: Boolean!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        id
        ...BranchSelect_repository
        ref(refName: $branchHead){
          target {
            ... on Commit {
              ...CommitList_commit
            }
          }
        }
      }
    }
  }
`;

export default Commits;
