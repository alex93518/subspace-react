import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Table, Button } from 'react-bootstrap';
import { timeFromNow } from 'utils/string';
import {
  LinkUserName,
  LinkUserPhoto,
  LinkCommit,
} from 'components/shared/Links';

const TableCommit = styled(Table)`
  background-color: white !important;
  margin: 3px;
`

const Td = styled.td`
  vertical-align: middle !important;
  padding: 8px !important;
  border-top: none !important;
`

const TdThumb = styled(Td)`
  width: 52px;
`

const TdCommitLink = styled(Td)`
  width: 120px;
  text-align: right;
`

const CommitMessage = styled.h4`
  margin-top: 0px;
  margin-bottom: 7px;
`

const Commit = ({
  commit: {
    oid,
    shortId,
    shortMessage,
    commitTime,
    author: {
      user,
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
            <TdThumb>
              <LinkUserPhoto user={user} width={36} height={36} />
            </TdThumb>
            <Td>
              <LinkCommit vars={{ ...variables, commitId: oid }}>
                <CommitMessage>{shortMessage}</CommitMessage>
              </LinkCommit>
              <span>
                <LinkUserName user={user} />
                {' '}
                committed {timeFromNow(commitTime)}
              </span>
            </Td>
            <TdCommitLink>
              <LinkCommit vars={{ ...variables, commitId: oid }}>
                <Button className="btn btn-sm">{shortId}</Button>
              </LinkCommit>
            </TdCommitLink>
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
    branchHead: 'master',
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
            ${LinkUserName.getFragment('user')}
            ${LinkUserPhoto.getFragment('user')}
          }
        }
      }
    `,
  },
})
