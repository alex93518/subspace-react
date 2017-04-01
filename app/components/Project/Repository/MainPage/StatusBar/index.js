import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col, Glyphicon } from 'react-bootstrap';
import styled from 'styled-components';

const RowSty = styled(Row)`
  background-color: white;
  border: 1px solid #DDD;
  padding: 10px;
`

const ColSty = styled(Col)`
  text-align: center;
`

const StatusBar = ({
  statusBar: {
    refs: {
      branchTotal,
    },
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
    <ColSty md={4}>
      <Glyphicon glyph="time" /> <bold>{commitTotal}</bold> Commits
    </ColSty>
    <ColSty md={4}>Pending Pushes</ColSty>
    <ColSty md={4}>
      <Glyphicon glyph="tasks" /> <bold>{branchTotal}</bold> Branches
    </ColSty>
  </RowSty>
)

StatusBar.propTypes = {
  statusBar: PropTypes.object.isRequired,
}

export default Relay.createContainer(StatusBar, {
  initialVariables: {
    branchHead: 'master',
  },
  fragments: {
    statusBar: () => Relay.QL`
      fragment on Repository {
        refs {
          branchTotal: totalCount
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
