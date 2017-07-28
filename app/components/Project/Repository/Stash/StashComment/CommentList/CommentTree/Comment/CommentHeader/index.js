import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, withHandlers } from 'recompose';
import { MenuItem } from 'react-bootstrap';
import moment from 'moment';
import { LinkUserName } from 'components/shared/Links';
import { SpanVoterStat, IconUp, IconDown, DropdownHead, IconMore } from './styles';

const CommentHeader = ({
  handleIsShowContent, isShowContent,
  commentHeader: { id, owner, isOwnerVoteUp, createdAt },
}) => (
  <div>
    <span>
      <LinkUserName userName={owner.userName} /> commented
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
          userName
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
