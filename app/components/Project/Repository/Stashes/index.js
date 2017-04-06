import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Link } from 'react-router';
import { Table, Button } from 'react-bootstrap';
import moment from 'moment';
import { redirect } from 'redux/utils'
import CurrentRelay, { MergeStashMutation } from 'relay';
import { getBasePath, getUserProfilePath } from 'utils/path';
import Commit from 'components/Project/Repository/Commits/CommitList/Commit'

const TableStashes = styled(Table)`
  margin-top: 20px;
  border: 1px solid rgba(27,31,35,0.15);
  padding: 8px 8px 0;
  border-radius: 3px;
  background-color: #fff;
  & tbody > tr >  {
    & .acceptStash {
      text-align: right;
    }
    & .commitList {
      border: 0px;
    }
    & td {
      padding: 10px 18px;
      vertical-align: middle;
      & .label {
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
        font-weight: 600;
        background-color: #eaf5ff;
        color: #0366d6;
        border-radius: 3px;
      }
      & .label-stash {
        font-size: 13px;
        padding: 4px 8px;
      }
      & .label-branch {
        padding: 4px 8px;
      }
      & span {
        margin-right: 7px;
      }
      & table > tbody > tr > td {
        background-color: white;
        border: 0px;
        padding: 3px 0px;
      }
    }
  }
`

const handleSubmit = ({ ...props }, relayVars) => {
  CurrentRelay.Store.commitUpdate(
    new MergeStashMutation({
      ...props
    }),
    {
      onSuccess: () => redirect(`${getBasePath(relayVars)}/master`),
      onFailure: transaction => console.log(transaction.getError()),
    }
  )
}

const shortBranchName = branchName =>
  branchName.replace('refs/heads/', '')

const Stashes = ({
  stashes: {
    stashes: {
      edges,
    },
  },
  relay: {
    variables,
  },
}) => (
  <div>
    {
      edges.map(({
        node: {
          id,
          name,
          history,
          repository,
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
        <TableStashes key={id}>
          <tbody>
            <tr>
              <td>
                <Link
                  to={
                    `${getBasePath(variables)}/${shortBranchName(name)}`
                  }
                >
                  <span className={'label label-stash'}>
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
              <td className="acceptStash">
                <Button
                  className="btn btn-info btn-sm"
                  onClick={() => 
                    handleSubmit({
                      repositoryId: repository.rawId,
                      stashName: name.replace("refs/heads/", "")
                    }, variables)
                  }
                >
                  Accept
                </Button>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                Changed from
                {' '}
                <Link to={`${getBasePath(variables)}/master`}>
                  <span className={'label label-branch'}>master</span>
                </Link>
                {' (Todo: support non master branches)'}:
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="commitList">
                <Table hover>
                  <tbody>
                    {
                      history.edges.map(({ node }) =>
                        <Commit commit={node} {...variables} key={node.id} />
                      )
                    }
                  </tbody>
                </Table>
              </td>
            </tr>
          </tbody>
        </TableStashes>
      ))
    }
  </div>
)

Stashes.propTypes = {
  stashes: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(Stashes, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    stashes: vars => Relay.QL`
      fragment on Repository {
        stashes(first: 99) {
          edges {
            node {
              id
              name
              repository {
                rawId
              }
              history(first: 99, isStash: true) {
                edges {
                  node {
                    id
                    ${Commit.getFragment('commit', vars)}
                  }
                }
              }
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
