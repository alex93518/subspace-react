import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import moment from 'moment';
import { Panel } from 'react-bootstrap';
import {
  LinkUserName,
  LinkUserPhoto,
} from 'components/shared/Links';

const CommentTitle = ({ owner, createdAt }) => (
  <span>
    <LinkUserName user={owner} /> commented
    {` ${moment(createdAt).fromNow()}`}
  </span>
)

CommentTitle.propTypes = {
  owner: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
}

const MainDiv = styled.div`
  position: relative;
  padding-left: 60px;
`

const DivLinkPhoto = styled.div`
  float: left;
  margin-left: -60px;
  border-radius: 3px;
`

const Comment = ({
  comment: { content, owner, createdAt },
}) => (
  <MainDiv>
    <DivLinkPhoto>
      <LinkUserPhoto user={owner} width={44} height={44} />
    </DivLinkPhoto>
    <Panel
      header={
        <CommentTitle
          owner={owner}
          createdAt={createdAt}
        />
      }
    >
      {content}
    </Panel>
  </MainDiv>
)

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
}

export default Relay.createContainer(Comment, {
  initialVariables: {
    branchHead: 'master',
    userName: null,
    projectName: null,
  },
  fragments: {
    comment: () => Relay.QL`
      fragment on StashComment {
        id
        owner {
          ${LinkUserName.getFragment('user')}
          ${LinkUserPhoto.getFragment('user')}
        }
        content
        createdAt
      }
    `,
  },
})
