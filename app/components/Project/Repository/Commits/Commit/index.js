import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import styled from 'styled-components';
import { Link } from 'react-router'
import { Table, Button } from 'react-bootstrap';

const TableCommit = styled(Table)`
  background-color: white !important;
  margin-bottom: 5px;
  & > tbody > tr > td {
    vertical-align: middle;
    padding: 8px;
    border-top: none;
    & > a > h4 {
      margin-top: 0px;
      margin-bottom: 7px;
    }
  }
`

const Commit = ({
  commit: {
    shortMessage,
    author: {
      user: {
        userName,
        fullName,
        photoUrl,
      },
    },
    commitTime,
  },
}) => (
  <tr>
    <td>
      <TableCommit hover>
        <tbody>
          <tr>
            <td style={{ width: '52px' }}>
              <Link to={`/profile/${userName}`}>
                <img alt={fullName} src={photoUrl} width={36} height={36} />
              </Link>
            </td>
            <td>
              <Link to={'#'}>
                <h4>{shortMessage}</h4>
              </Link>
              <span><Link to={`/profile/${userName}`}>{userName}</Link> committed {moment.unix(commitTime).fromNow()}</span>
            </td>
            <td>
              <Link to={'#'}>
                <Button>Details</Button>
              </Link>
            </td>
          </tr>
        </tbody>
      </TableCommit>
    </td>
  </tr>
)

Commit.propTypes = {
  commit: PropTypes.object.isRequired,
}

export default Relay.createContainer(Commit, {
  fragments: {
    commit: () => Relay.QL`
      fragment on Commit {
        id
        shortMessage
        commitTime
        author {
          user {
            userName
            fullName
            photoUrl
          }
        }
      }
    `,
  },
})
