import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import moment from 'moment';
import { Link } from 'react-router';
import { Table, Row, Col, Glyphicon } from 'react-bootstrap';
import {
  getBaseProjectPath,
  getUserProfilePath,
  getBlobPath,
} from 'utils/path';

const TableHead = styled(Table)`
  margin-top: 15px;
  border: 1px solid rgba(27,31,35,0.15);
  padding: 8px 8px 0;
  border-radius: 3px;
  background-color: #fff;
  & > tbody > tr {
    & > td.head {
      background-color: #eaf5ff;
      & > .commit-title {
        font-size: 18px;
        font-weight: 600;
        color: #555;
      }
      & > p > a {
        color: #444d56;
        margin-left: 5px;
      }
    }
    & td > div > div > a {
      margin-left: 5px;
      color: #444d56;
    }
    & td > div > div.commitId {
      text-align: right;
    }
  }
`

const Commit = ({
  commit: {
    ref: {
      commit: {
        oid,
        fullMessage,
        diff,
        commitTime,
        author: {
          user: {
            userName,
            photoUrl,
          },
        },
      },
    },
  },
  relay: {
    variables,
    variables: {
      branchHead,
    },
  },
}) => (
  <div>
    <TableHead>
      <tbody>
        <tr>
          <td className={'head'}>
            <p className={'commit-title'}>
              {fullMessage}
            </p>
            <p>
              <Glyphicon glyph={'open'} />
              <Link to={getBaseProjectPath(variables)}>
                {branchHead}
              </Link>
            </p>
          </td>
        </tr>
        <tr>
          <td>
            <Row>
              <Col md={6}>
                <img
                  src={photoUrl}
                  alt={`@${userName}`}
                  width={24}
                  height={24}
                />
                <Link to={getUserProfilePath(userName)}>
                  {userName}
                </Link> committed {moment.unix(commitTime).fromNow()}
              </Col>
              <Col md={6} className={'commitId'}>
                commit {oid}
              </Col>
            </Row>
          </td>
        </tr>
      </tbody>
    </TableHead>
    <div>
      <div>
        Showing {diff.length} changed files:
      </div>
      {
        diff.map(file =>
          <div key={`${file.oldPath}${file.newPath}`}>
            {
              file.changeType === 'DELETE' ?
                file.newPath :
                <Link to={getBlobPath(variables, file.newPath)}>
                  {file.newPath}
                </Link>
             } - {file.changeType}
          </div>
        )
      }
      <hr />
    </div>
  </div>
)

Commit.propTypes = {
  commit: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Commit, {
  initialVariables: {
    branchHead: 'master',
    projectName: null,
    userName: null,
    commitId: null,
  },
  fragments: {
    commit: () => Relay.QL`
      fragment on Repository {
        ref(refName: $branchHead) {
          commit(commitId: $commitId) {
            oid
            shortId
            fullMessage
            commitTime
            author {
              user {
                userName
                photoUrl
              }
            }
            diff {
              changeType
              oldPath
              newPath
            }
          }
        }
      }
    `,
  },
})
