import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import styled from 'styled-components';
import { Link } from 'react-router'
import { Table, Button } from 'react-bootstrap';
import { getCommitPath } from 'utils/path';

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
  & > tbody > tr > td.thumbs {
    width: 52px;
  }
  & > tbody > tr > td.commitLink {
    width: 120px;
    text-align: right;
  }
`

const Commit = ({
  commit: {
    oid,
    shortId,
    shortMessage,
    commitTime,
    author: {
      user: {
        userName,
        fullName,
        photoUrl,
      },
    },
  },
  relay: {
    variables,
  },
}) => (
  <tr>
    <td>
      <TableCommit hover>
        <tbody>
          <tr>
            <td className={'thumbs'}>
              <Link to={`/profile/${userName}`}>
                <img alt={fullName} src={photoUrl} width={36} height={36} />
              </Link>
            </td>
            <td>
              <Link to={getCommitPath(variables, oid)}>
                <h4>{shortMessage}</h4>
              </Link>
              <span>
                <Link
                  to={`/profile/${userName}`}
                >
                  {userName}
                </Link> committed {moment.unix(commitTime).fromNow()}</span>
            </td>
            <td className={'commitLink'}>
              <Link to={getCommitPath(variables, oid)}>
                <Button>{shortId}</Button>
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
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Commit, {
  initialVariables: {
    userName: null,
    projectName: null,
  },
  fragments: {
    commit: () => Relay.QL`
      fragment on Commit {
        oid
        shortId
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
