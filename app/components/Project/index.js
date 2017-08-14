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
import GoRepoPush from 'react-icons/lib/go/repo-push';
import FaObjectGroup from 'react-icons/lib/fa/object-group';
import MdHome from 'react-icons/lib/md/home';
import NavTabs from 'components/shared/NavTabs';
import RepoLink from 'components/shared/repo/TitleLink'
import { matchRoute } from 'utils/routeMatcher';
import Repository from './Repository'
import {
  NavLabel, TopContainer, RepoTitle, HeightDiv, Icon,
} from './styles'

const getNavConfig = ({ owner: { userName }, name, stashes: { totalCount } }) => [
  {
    link: `/${userName}/${name}/#home`,
    label: (
      <NavLabel>
        <Icon><MdHome /></Icon> Home
      </NavLabel>
    ),
  },
  {
    link: `/${userName}/${name}`,
    label: (
      <NavLabel>
        <Icon><GoCode /></Icon> Code
      </NavLabel>
    ),
  },
  {
    link: `/${userName}/${name}#issues`,
    label: (
      <NavLabel>
        <Icon><GoIssueOpened /></Icon> Goals &amp; Issues
      </NavLabel>
    ),
  },
  {
    link: `/${userName}/${name}#metaspace`,
    label: (
      <NavLabel>
        <Icon><FaObjectGroup /></Icon> Metaspace
      </NavLabel>
    ),
  },
  {
    link: `/${userName}/${name}/master/stashes`,
    label: (
      <NavLabel>
        <Icon><GoRepoPush /></Icon> { totalCount } Pending Contributions
      </NavLabel>
    ),
  },
]

const getConfigActiveKey = (owner, name) => {
  const config = getNavConfig(owner, name)
  return {
    config,
    activeKey: config[1].link,
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
                    getConfigActiveKey(repository)
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
        stashes {
          totalCount
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
