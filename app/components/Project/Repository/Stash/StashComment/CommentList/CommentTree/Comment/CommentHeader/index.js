import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, withHandlers } from 'recompose';
import moment from 'moment';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import styled from 'styled-components';
import { LinkUserName } from 'components/shared/Links';
import FaCaretUp from 'react-icons/lib/fa/caret-up';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import MdMoreVert from 'react-icons/lib/md/more-vert';

const SpanVoterStat = styled.span`
  display: inline-block;
  float: right;
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

const DropdownHead = styled(DropdownButton)`
  margin-left: 10px !important;
  background: transparent !important;
  padding: 0px !important;
  border: 0px !important;
`

const IconMore = styled(MdMoreVert)`
  color: #777;
  cursor: pointer;
  font-size: 16px;
  vertical-align: text-bottom !important;
`

const CommentHeader = ({
  handleIsShowContent, isShowContent,
  commentHeader: { id, owner, isOwnerVoteUp, createdAt },
}) => (
  <div>
    <span>
      <LinkUserName user={owner} /> commented
      {` ${moment(createdAt).fromNow()}`}
    </span>
    <SpanVoterStat>
      {
        isOwnerVoteUp !== null &&
        <span>
          {
            isOwnerVoteUp ?
              <span>
                <IconUp />
                <span>Upvoter</span>
              </span> :
              <span>
                <IconDown />
                <span>Downvoter</span>
              </span>
          }
        </span>
      }
      <DropdownHead
        id={`dropdown-${id}`}
        title={<IconMore />}
        noCaret
        pullRight
      >
        <MenuItem onClick={handleIsShowContent}>
          {isShowContent ? 'Hide' : 'Show'} content
        </MenuItem>
        <MenuItem>Report spam or abuse</MenuItem>
      </DropdownHead>
    </SpanVoterStat>
  </div>
)

CommentHeader.propTypes = {
  commentHeader: PropTypes.object.isRequired,
  isShowContent: PropTypes.bool.isRequired,
  handleIsShowContent: PropTypes.func.isRequired,
};

export default compose(
  withRelayFragment({
    commentHeader: graphql`
      fragment CommentHeader_commentHeader on StashComment {
        id
        owner {
          ...LinkUserName_user
        }
        isOwnerVoteUp
        createdAt        
      }
    `,
  }),
  withHandlers({
    handleIsShowContent: props => () => {
      props.updateIsShowContent(!props.isShowContent)
    },
  }),
)(CommentHeader)
