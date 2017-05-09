import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components'
import { Grid } from 'react-bootstrap';
import { GoCode, GoIssueOpened, GoQuestion } from 'react-icons/lib/go'
import NavTabs from 'components/shared/NavTabs';
import RepoLink from 'components/shared/repo/TitleLink'
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

const Project = ({
  viewer: {
    repository,
    repository: {
      name,
      owner,
      isPrivate,
    },
  },
  relay: {
    variables,
  },
}) => (
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
        <NavTabs config={getNavConfig(owner.userName, name)} />
      </Grid>
    </TopContainer>
    <MainContainer>
      <Repository
        {...variables}
        repository={repository}
      />
    </MainContainer>
  </div>
)

Project.propTypes = {
  viewer: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Project, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
    splat: null,
    commitId: null,
  },
  fragments: {
    viewer: vars => Relay.QL`
      fragment on Viewer {
        repository(owner: $userName, name: $projectName) {
          ${Repository.getFragment('repository', vars)}
          name
          owner {
            userName
          }
          isPrivate
        }
      }
    `,
  },
})
