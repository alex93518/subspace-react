import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { Panel } from 'react-bootstrap';
import { LinkUserPhoto } from 'components/shared/Links';
import CommentHeader from './CommentHeader';
import CommentFooter from './CommentFooter';

const MainDiv = styled.div`
  position: relative;
  padding-left: 60px;
  flex: 1;
`

const DivLinkPhoto = styled.div`
  float: left;
  margin-left: -60px;
  border-radius: 3px;
`

const Comment = ({
  comment, isShowFooter, stashData, parentId,
  comment: { content, owner },
}) => (
  <MainDiv>
    <DivLinkPhoto>
      <LinkUserPhoto user={owner} width={44} height={44} />
    </DivLinkPhoto>
    <Panel
      header={
        <CommentHeader commentHeader={comment} />
      }
      footer={isShowFooter ?
        <CommentFooter
          stashData={stashData}
          parentId={parentId}
        /> : null}
    >
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Panel>
  </MainDiv>
)

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
  isShowFooter: PropTypes.bool,
  stashData: PropTypes.object.isRequired,
  parentId: PropTypes.string,
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
        ${CommentHeader.getFragment('commentHeader')}
        id
        owner {
          ${LinkUserPhoto.getFragment('user')}
        }
        content
        createdAt
      }
    `,
  },
})
