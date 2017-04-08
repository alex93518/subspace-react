import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import {
  LinkUserName,
  LinkUserPhoto,
  LinkCommit,
} from 'components/shared/Links';
import { timeFromNow } from 'utils/string';

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

const LinkUser = styled(LinkUserName)`
  margin-left: 10px;
`

const LinkShortId = styled(LinkCommit)`
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  color: #586069;
  margin-left: 7px;
  margin-right: 7px;
`

const LinkShortMsg = styled(LinkCommit)`
  color: #586069;
  margin-left: 7px;
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
      user,
    },
  },
  relay: {
    variables,
  },
}) => (
  <RowSty>
    <ColSty md={6}>
      <LinkUserPhoto user={user} width={20} height={20} />
      <LinkUser user={user} />
      <LinkShortMsg vars={{ ...variables, commitId: oid }}>
        {shortMessage}
      </LinkShortMsg>
    </ColSty>
    <ColTime md={6}>
      Latest commit
      <LinkShortId vars={{ ...variables, commitId: oid }}>
        {shortId}
      </LinkShortId>
      {timeFromNow(commitTime)}
    </ColTime>
  </RowSty>
)

LastCommit.propTypes = {
  lastCommit: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(LastCommit, {
  initialVariables: {
    branchHead: 'master',
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
            ${LinkUserName.getFragment('user')}
            ${LinkUserPhoto.getFragment('user')}
          }
        }
      }
    `,
  },
})
