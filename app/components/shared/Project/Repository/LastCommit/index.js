import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import styled from 'styled-components';
import {
  LinkUserName,
  LinkUserPhoto,
  LinkCommit,
} from 'components/shared/Links';
import { timeFromNow } from 'utils/string';

const DivCommit = styled.div`
  padding: 10px;
  margin-bottom:-1px;
  line-height:20px;
  color:#586069;
  background-color:#f1f8ff;
  border:1px solid #c8e1ff;
  border-radius:3px;
  border-bottom-right-radius:0;
  border-bottom-left-radius:0;
  clear: both;
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

const DivUser = styled.div`
  display: inline-block;
`

const DivStatus = styled.div`
  display: inline-block;
  float: right;
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
}) => (
  <DivCommit>
    <DivUser>
      <LinkUserPhoto user={user} width={20} height={20} />
      <LinkUser user={user} />
      <LinkShortMsg to={oid}>
        {shortMessage}
      </LinkShortMsg>
    </DivUser>
    <DivStatus>
      Latest commit
      <LinkShortId to={oid}>
        {shortId}
      </LinkShortId>
      {timeFromNow(commitTime)}
    </DivStatus>
  </DivCommit>
);

LastCommit.propTypes = {
  lastCommit: PropTypes.object.isRequired,
}

export default createFragmentContainer(LastCommit, {
  lastCommit: graphql`
    fragment LastCommit_lastCommit on Commit {
      shortMessage
      commitTime
      shortId
      oid
      author {
        user {
          ...LinkUserName_user
          ...LinkUserPhoto_user
        }
      }
    }
  `,
})
