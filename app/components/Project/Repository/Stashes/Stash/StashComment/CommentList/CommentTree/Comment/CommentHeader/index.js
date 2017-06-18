import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import styled from 'styled-components';
import { LinkUserName } from 'components/shared/Links';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import FaCaretDown from 'react-icons/lib/fa/caret-down';

const SpanVoterStat = styled.span`
  display: inline-block;
  float: right;
`

const SpanTextStat = styled.span`
  font-size: 12px;
  color: #777;
`

const IconUp = styled(FaCaretUp)`
  font-size: 16px;
  margin-right: 3px;
  vertical-align: sub !important;
  color: #2cbe4e;
`

const IconDown = styled(FaCaretDown)`
  font-size: 16px;
  margin-right: 3px;
  vertical-align: sub !important;
  color: #cb2431;
`

const CommentHeader = ({
  commentHeader: { owner, isOwnerVoteUp, createdAt },
}) => (
  <div>
    <span>
      <LinkUserName user={owner} /> commented
      {` ${moment(createdAt).fromNow()}`}
    </span>
    {
      isOwnerVoteUp !== null &&
      <SpanVoterStat>
        {
          isOwnerVoteUp ?
            <div>
              <IconUp />
              <SpanTextStat>Upvoter</SpanTextStat>
            </div> :
            <div>
              <IconDown />
              <SpanTextStat>Downvoter</SpanTextStat>
            </div>
        }
      </SpanVoterStat>
    }
  </div>
)

CommentHeader.propTypes = {
  commentHeader: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommentHeader, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    commentHeader: () => Relay.QL`
      fragment on StashComment {
        owner {
          ${LinkUserName.getFragment('user')}
        }
        isOwnerVoteUp
        createdAt        
      }
    `,
  },
})
