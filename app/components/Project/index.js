import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import { compose, mapProps } from 'recompose';
import styled from 'styled-components'
import { withRouter } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import GoCode from 'react-icons/lib/go/code'
import GoIssueOpened from 'react-icons/lib/go/issue-opened'
import GoQuestion from 'react-icons/lib/go/question'
import NavTabs from 'components/shared/NavTabs';
import RepoLink from 'components/shared/repo/TitleLink'
import { matchRoute } from 'utils/routeMatcher';
import Repository from './Repository'

const NavLabel = styled.span`
  color: #777;
`

const getNavConfig = (owner, name) => [
  {
    link: `/${owner}/${name}`,
    label: (<NavLabel><GoCode /> Code</NavLabel>),
  },
  {
    link: `/${owner}/${name}#issues`,
    label: (<NavLabel><GoIssueOpened /> Issues</NavLabel>),
  },
  {
    link: `/${owner}/${name}#qa`,
    label: (<NavLabel><GoQuestion /> Q&amp;A</NavLabel>),
  },
]

const RepoTitle = styled.h3`
  margin-bottom: 25px;
`
const TopContainer = styled.div`
  background-color: #fafbfc;
  border-bottom: 1px solid #dddddd;
`
const MainContainer = styled.div`
  background-color: #fff;
  padding-bottom: 30px;
`

const getConfigActiveKey = (owner, name) => {
  const config = getNavConfig(owner, name)
  return {
    config,
    activeKey: config[0].link,
  }
}

const Project = ({ vars }) => (
  <QueryRenderer
    environment={env}
    variables={vars}
    query={query}
    render={({ error, props }) => {
      if (error) {
        throw error;
      } else if (props) {
        const {
          viewer: {
            repository,
            repository: {
              name,
              owner,
              isPrivate,
            },
          },
        } = props;
        return (
          <div>
            <TopContainer>
              <Grid>
                <RepoTitle>
                  <RepoLink
                    repoName={name}
                    isPrivate={isPrivate}
                    userName={owner.userName}
                  />
                </RepoTitle>
                <NavTabs
                  configActive={getConfigActiveKey(owner.userName, name)}
                />
              </Grid>
            </TopContainer>
            <MainContainer>
              <Repository repository={repository} />
            </MainContainer>
          </div>
        );
      }
      return <LoadingIndicator />;
    }}
  />
);

Project.propTypes = {
  viewer: PropTypes.object,
  vars: PropTypes.object.isRequired,
}

const query = graphql`
  query ProjectQuery(
    $userName: String!, $projectName: String!, $sort: String!,
    $branchHead: String!, $splat: String, $commitId: String!, $stashNum: String!,
    $isMainContainer: Boolean!, $isBranches: Boolean!, $isCommits: Boolean!,
    $isStash: Boolean!, $isStashes: Boolean!, $isCommit: Boolean!,
    $isBlob: Boolean!, $isTree: Boolean!
  ) {
    viewer {
      repository(owner: $userName, name: $projectName) {
        name
        owner {
          userName
        }
        isPrivate
        ...Repository_repository
      }
    }
  }
`;

export default compose(
  withRouter,
  mapProps(({
    childName,
    location: { pathname },
  }) => {
    const params = matchRoute(pathname).params;
    return ({
      vars: {
        userName: params.userName,
        projectName: params.projectName,
        branchHead: params.branchHead || 'master',
        commitId: params.commitId || '',
        stashNum: params.stashNum ? `stash-${params.stashNum}` : 'stash-1',
        splat: params['0'] || null,
        sort: 'popular',
        isMainContainer: childName === 'MainContainer',
        isTree: childName === 'TreeContainer',
        isBlob: childName === 'BlobContainer',
        isCommits: childName === 'Commits',
        isCommit: childName === 'Commit',
        isStashes: childName === 'Stashes',
        isStash: childName === 'Stash',
        isBranches: childName === 'Branches',
      },
    });
  })
)(Project);
