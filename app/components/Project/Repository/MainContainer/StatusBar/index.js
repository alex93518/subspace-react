import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import styled from 'styled-components';
import { LinkBranch, LinkProject } from 'components/shared/Links';

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
    <ColSty md={4}>
      <LinkBranch to={'commits'} vars={variables}>
        <Glyphicon glyph="time" />
        {' '}
        {commitTotal} Commits
      </LinkBranch>
    </ColSty>
    <ColSty md={4}>
      <LinkBranch to={'stashes'} vars={variables}>
        <Glyphicon glyph="warning-sign" />
        {' '}
        {stashesTotal} Pending Pushes
      </LinkBranch>
    </ColSty>
    <ColSty md={4}>
      <LinkProject to={'branches'} vars={variables}>
        <Glyphicon glyph="tasks" />
        {' '}
        {branchTotal} Branches
      </LinkProject>
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
