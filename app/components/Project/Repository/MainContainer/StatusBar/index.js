import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { LinkBranch, LinkProject } from 'components/shared/Links';
import GoHistory from 'react-icons/lib/go/history'
import GoRepoPush from 'react-icons/lib/go/repo-push'
import GoGitBranch from 'react-icons/lib/go/git-branch'
import GoOrganization from 'react-icons/lib/go/organization'

const RowSty = styled(Row)`
  background-color: white;
  border: 1px solid #DDD;
  padding: 10px;
  & a {
    color: #444 !important;
  }
`

const ColSty = styled(Col)`
  text-align: center;
`

const Icon = styled.span`
  font-size: 18px;
  color: #777;
`

const StatusBar = ({
  statusBar: {
    refs: { branchTotal },
    stashes: { stashesTotal },
    ref: {
      target: {
        history: {
          commitTotal,
        },
      },
    },
  },
  relay: { variables },
}) => (
  <RowSty>
    <ColSty md={3}>
      <LinkBranch to={'commits'} vars={variables}>
        <Icon><GoHistory /></Icon>
        {' '}
        {commitTotal} Commits
      </LinkBranch>
    </ColSty>
    <ColSty md={3}>
      <LinkBranch to={'stashes'} vars={variables}>
        <Icon><GoRepoPush /></Icon>
        {' '}
        {stashesTotal} Pending Pushes
      </LinkBranch>
    </ColSty>
    <ColSty md={3}>
      <LinkProject to={'branches'} vars={variables}>
        <Icon><GoGitBranch /></Icon>
        {' '}
        {branchTotal} Branches
      </LinkProject>
    </ColSty>
    <ColSty md={3}>
      <Icon><GoOrganization /></Icon>
      {' '}
      n Contributors
    </ColSty>
  </RowSty>
)

StatusBar.propTypes = {
  statusBar: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(StatusBar, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    statusBar: () => Relay.QL`
      fragment on Repository {
        refs {
          branchTotal: totalCount
        }
        stashes {
          stashesTotal: totalCount
        }
        ref(refName: $branchHead) {
          target {
            ... on Commit {
              history {
                commitTotal: totalCount
              }
            }
          }
        }
      }
    `,
  },
})
