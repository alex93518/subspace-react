import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';
import moment from 'moment';
import { getBasePath, getUserProfilePath } from 'utils/path';

const TableBranches = styled(Table)`
  margin-top: 20px;
  border: 1px solid rgba(27,31,35,0.15);
  padding: 8px 8px 0;
  border-radius: 3px;
  background-color: #fff;
  & tbody > tr > td {
    padding: 18px;
    & .label-branch {
      font: 12px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      padding: 2px 6px;
      background-color: #eaf5ff;
      color: #0366d6;
      border-radius: 3px;
    }
    & span {
      margin-left: 7px;
    }
  }
`

const shortBranchName = branchName =>
  branchName.replace('refs/heads/', '')

const Branches = ({
  branches: {
    refs: {
      edges,
    },
  },
  relay: {
    variables,
  },
}) => (
  <TableBranches>
    <tbody>
      {
        edges.map(({
          node: {
            id,
            name,
            target: {
              commitTime,
              author: {
                user: {
                  userName,
                },
              },
            },
          },
        }) => (
          <tr key={id}>
            <td>
              <Link
                to={
                  `${getBasePath(variables)}/${shortBranchName(name)}`
                }
              >
                <span className={'label-branch'}>
                  {shortBranchName(name)}
                </span>
              </Link>
              <span>
                Updated {moment.unix(commitTime).fromNow()} by <Link
                  to={getUserProfilePath(userName)}
                >
                  {userName}
                </Link>
              </span>
            </td>
          </tr>
        ))
      }
    </tbody>
  </TableBranches>
)

Branches.propTypes = {
  branches: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Branches, {
  initialVariables: {
    userName: null,
    projectName: null,
  },
  fragments: {
    branches: () => Relay.QL`
      fragment on Repository {
        refs(first: 99) {
          edges {
            node {
              id
              name
              target {
                ... on Commit {
                  commitTime
                  author {
                    user {
                      userName
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
})
