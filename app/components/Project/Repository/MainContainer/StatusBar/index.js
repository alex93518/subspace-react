import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { LinkBranch, LinkProject } from 'components/shared/Links';
import GoHistory from 'react-icons/lib/go/history';
import GoRepoPush from 'react-icons/lib/go/repo-push';
import GoGitBranch from 'react-icons/lib/go/git-branch';
import GoOrganization from 'react-icons/lib/go/organization';

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
    stashesTotalCount: { stashesTotal },
    ref: {
      target: {
        history: {
          commitTotal,
        },
      },
    },
  },
}) => (
  <RowSty>
    <ColSty md={3}>
      <LinkBranch to={'commits'}>
        <Icon><GoHistory /></Icon>
        {' '}
        {commitTotal} Commits
      </LinkBranch>
    </ColSty>
    <ColSty md={3}>
      <LinkBranch to={'stashes'}>
        <Icon><GoRepoPush /></Icon>
        {' '}
        {stashesTotal} Pending Pushes
      </LinkBranch>
    </ColSty>
    <ColSty md={3}>
      <LinkProject to={'branches'}>
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
}

export default createFragmentContainer(StatusBar, {
  statusBar: graphql`
    fragment StatusBar_statusBar on Repository {
      refs(first: 99) @include(if: $isMainContainer){
        branchTotal: totalCount
      }
      stashesTotalCount: stashes @include(if: $isMainContainer){
        stashesTotal: totalCount
      }
      ref(refName: $branchHead) @include(if: $isMainContainer){
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
})
