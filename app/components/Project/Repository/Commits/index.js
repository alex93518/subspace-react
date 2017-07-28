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
  commits: {
    ref: {
      target,
    },
  },
  commits, splat,
}) => (
  <MainGrid>
    <DivCommits>
      <BranchSelect
        branchSelect={commits}
        suffix={`commits${splat ? `/${splat}` : ''}`}
      />
      <CommitList commitList={target} />
    </DivCommits>
  </MainGrid>
)

Commits.propTypes = {
  commits: PropTypes.object.isRequired,
  splat: PropTypes.string,
};

export default compose(
  withRouter,
  withRelayFragment({
    commits: graphql`
      fragment Commits_commits on Repository {
        ...BranchSelect_branchSelect
        ref(refName: $branchHead) @include(if: $isCommits){
          target {
            ... on Commit {
              ...CommitList_commitList
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
