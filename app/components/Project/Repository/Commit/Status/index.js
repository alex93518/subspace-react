import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { LinkUserName, LinkUserPhoto } from 'components/shared/Links';
import { timeFromNow } from 'utils/string';

const Td = styled.td`
  padding: 15px !important;
`

const ColCommitId = styled(Col)`
  text-align: right;
`

const UserName = styled(LinkUserName)`
  margin-left: 10px;
`

const CommitStatus = ({
  commitStatus: {
    oid,
    commitTime,
    author: {
      user,
    },
  },
}) => (
  <tr>
    <Td>
      <Row>
        <Col md={6}>
          <LinkUserPhoto user={user} width={24} height={24} />
          <UserName user={user} />
          {' '}
          committed {timeFromNow(commitTime)}
        </Col>
        <ColCommitId md={6}>
          commit {oid}
        </ColCommitId>
      </Row>
    </Td>
  </tr>
)

CommitStatus.propTypes = {
  commitStatus: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommitStatus, {
  fragments: {
    commitStatus: () => Relay.QL`
      fragment on Commit {
        oid
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
