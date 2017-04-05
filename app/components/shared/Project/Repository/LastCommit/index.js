import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Link } from 'react-router';
import moment from 'moment';
import { Row, Col } from 'react-bootstrap';
import { getCommitPath, getUserProfilePath } from 'utils/path';

const RowSty = styled(Row)`
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom:-16px;
  font-size:13px;
  line-height:20px;
  color:#586069;
  background-color:#f1f8ff;
  border:1px solid #c8e1ff;
  border-radius:3px;
  border-bottom-right-radius:0;
  border-bottom-left-radius:0;
`

const LinkUserName = styled(Link)`
  margin-left: 10px;
  color: #777;
  font-weight: 600;
`

const LinkCommit = styled(Link)`
  margin-left: 7px;
  color: #586069;
`

const LinkShortId = styled(Link)`
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  color: #586069;
  margin-left: 7px;
  margin-right: 7px;
`

const ColSty = styled(Col)`
  padding-left: 10px !important;
  padding-right: 10px !important;
`

const ColTime = styled(ColSty)`
  text-align: right;
`

const LastCommit = ({
  lastCommit: {
    shortMessage,
    commitTime,
    shortId,
    oid,
    author: {
      user: {
        userName,
        photoUrl,
      },
    },
  },
  relay: {
    variables,
  },
}) => (
  <RowSty>
    <ColSty md={6}>
      <img
        alt={`@${userName}`}
        src={photoUrl}
        height={20}
        width={20}
      />
      <LinkUserName to={getUserProfilePath(userName)}>
        {userName}
      </LinkUserName>
      <LinkCommit to={getCommitPath(variables, oid)}>
        {shortMessage}
      </LinkCommit>
    </ColSty>
    <ColTime md={6}>
      Latest commit
      <LinkShortId to={getCommitPath(variables, oid)}>
        {shortId}
      </LinkShortId>
      {moment.unix(commitTime).fromNow()}
    </ColTime>
  </RowSty>
)

LastCommit.propTypes = {
  lastCommit: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(LastCommit, {
  initialVariables: {
    userName: null,
    projectName: null,
  },
  fragments: {
    lastCommit: () => Relay.QL`
      fragment on Commit {
        shortMessage
        commitTime
        shortId
        oid
        author {
          user {
            userName
            photoUrl
          }
        }
      }
    `,
  },
})
