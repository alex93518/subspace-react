import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import BranchSelect from 'components/shared/Project/Repository/BranchSelect';
import MainGrid from 'components/shared/MainGrid';
import { matchRoute } from 'utils/routeMatcher';
import CommitList from './CommitList';
import { DivCommits } from './styles';

const Commits = ({
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

Commits.propTypes = {
  repository: PropTypes.object.isRequired,
  splat: PropTypes.string,
};

export default compose(
  withRouter,
  withRelayFragment({
    repository: graphql`
      fragment Commits_repository on Repository {
        ...BranchSelect_repository
        ref(refName: $branchHead) @include(if: $isCommits){
          target {
            ... on Commit {
              ...CommitList_commit
            }
          }
        }
      }
    `,
  }),
  mapProps(({
    location: { pathname },
    ...rest
  }) => ({
    splat: matchRoute(pathname).params['0'] || null,
    ...rest,
  }))
)(Commits);
