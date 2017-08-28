import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { LinkUserPhoto } from 'components/shared/Links';
import { timeFromNow } from 'utils/string';
import {
  DivCommit, DivUser, LinkUser, LinkShortMsg, DivStatus, LinkShortId,
} from './styles'

const LastCommit = ({
  commit: {
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
      <LinkUser userName={user.userName} />
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
  commit: PropTypes.object.isRequired,
}

export default createFragmentContainer(LastCommit, {
  commit: graphql`
    fragment LastCommit_commit on Commit {
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
})
