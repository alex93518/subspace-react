import React, { PropTypes } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import styled from 'styled-components';
import ProviderLink from './ProviderLink';

const UserPanel = styled(Panel)`
  text-align: center;
`

const RowInfoPanel = styled(Row)`
  margin-top: 10px;
`

const HeadUserName = styled.h2`
  margin-top: 0px;
`

const SubHeadUserName = styled.h4`
  margin-top: 0px;
`

const MainAccount = ({
  user, isOwner, onProviderClick,
  stackexchange, github, google,
}) => (
  <Row>
    <Col md={3}>
      <UserPanel>
        <img
          alt={user.fullName}
          src={user.photoUrl}
          width={140}
          height={140}
          style={{ marginBottom: 10 }}
        />
      </UserPanel>
    </Col>
    <Col md={9}>
      <RowInfoPanel>
        <Col md={7}>
          <HeadUserName>{user.userName}</HeadUserName>
          <SubHeadUserName>{user.fullName}</SubHeadUserName>
          {user.email && <div>Email: {user.email}</div>}
          <ProviderLink
            isOwner={isOwner}
            providerName={'Stackoverflow'}
            providerData={stackexchange}
            handleClick={onProviderClick}
            tabKey={2}
          />
          <ProviderLink
            isOwner={isOwner}
            providerName={'Github'}
            providerData={github}
            handleClick={onProviderClick}
            tabKey={3}
          />
          <ProviderLink
            isOwner={isOwner}
            providerName={'Google'}
            providerData={google}
            handleClick={onProviderClick}
            tabKey={4}
          />
        </Col>
        <Col md={5}>
        </Col>
      </RowInfoPanel>
    </Col>
  </Row>
)

MainAccount.propTypes = {
  user: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  stackexchange: PropTypes.object,
  github: PropTypes.object,
  google: PropTypes.object,
  onProviderClick: PropTypes.func.isRequired,
}

export default MainAccount
