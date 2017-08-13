import React from 'react';
import PropTypes from 'prop-types';
import { QueryRenderer, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';
import { compose, mapProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import { Grid } from 'react-bootstrap';
import GoCode from 'react-icons/lib/go/code'
import GoIssueOpened from 'react-icons/lib/go/issue-opened'
import GoQuestion from 'react-icons/lib/go/question'
import NavTabs from 'components/shared/NavTabs';
import RepoLink from 'components/shared/repo/TitleLink'
import { matchRoute } from 'utils/routeMatcher';
import Repository from './Repository'
import {
  NavLabel, TopContainer, RepoTitle, HeightDiv,
} from './styles'

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
    query={topQuery}
    render={({ error, props }) => {
      if (error) {
        throw error;
      } else if (props) {
        const {
          viewer: {
            repository,
          },
        } = props;
        return (
          repository &&
          <HeightDiv>
            <TopContainer>
              <Grid>
                <RepoTitle>
                  <RepoLink
                    repoName={repository.name}
                    isPrivate={repository.isPrivate}
                    userName={repository.owner.userName}
                  />
                </RepoTitle>
                <NavTabs
                  configActive={
                    getConfigActiveKey(repository.owner.userName, repository.name)
                  }
                />
              </Grid>
            </TopContainer>
            <Repository />
          </HeightDiv>
        );
      }
      return <HeightDiv><LoadingIndicator /></HeightDiv>;
    }}
  />
);

Project.propTypes = {
  viewer: PropTypes.object,
  vars: PropTypes.object.isRequired,
}

const topQuery = graphql`
  query ProjectQuery(
    $userName: String!, $projectName: String!
  ) {
    viewer {
      repository(ownerName: $userName, name: $projectName) {
        name
        owner {
          userName
        }
        isPrivate
      }
    }
  }
`;

export default compose(
  withRouter,
  mapProps(({
    location: { pathname },
  }) => {
    const params = matchRoute(pathname).params;
    return ({
      vars: {
        userName: params.userName,
        projectName: params.projectName,
      },
    });
  })
)(Project);
