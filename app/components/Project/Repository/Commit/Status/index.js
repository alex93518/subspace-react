import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
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
};

export default createFragmentContainer(CommitStatus, {
  commitStatus: graphql`
    fragment Status_commitStatus on Commit {
      oid
      commitTime
      author {
        user {
          ...LinkUserName_user
          ...LinkUserPhoto_user
        }
      }
    }
  `,
})
