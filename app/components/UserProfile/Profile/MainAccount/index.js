import React, { PropTypes } from 'react';
import { Row, Col, Panel } from 'react-bootstrap';
import styled from 'styled-components';
import Separator from 'components/shared/Separator';
import { FaUser } from 'react-icons/lib/fa';
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

const SubHead = styled.h4`
  margin-top: 0px;
  margin-bottom: 15px;
`

const NameSeparator = styled(Separator)`
  margin-top: 0px;
`

const UserIcon = styled(FaUser)`
  font-size: 140px;
  color: rgba(3, 102, 214, 0.54);
`

const MainAccount = ({
  user, isOwner, onProviderClick,
  stackexchange, github, google,
}) => (
  <Row>
    <Col md={3}>
      <UserPanel>
        {
          user.photoUrl ?
            <img
              alt={user.fullName}
              src={user.photoUrl}
              width={140}
              height={140}
              style={{ marginBottom: 10 }}
            /> :
            <UserIcon />
        }
      </UserPanel>
    </Col>
    <Col md={9}>
      <RowInfoPanel>
        <Col md={12}>
          <HeadUserName>{user.userName}</HeadUserName>
          <SubHead>{user.fullName}</SubHead>
          {user.email && <div>Email: {user.email}</div>}
          <NameSeparator />
          {
            (stackexchange || github || google || isOwner) &&
            <SubHead>Linked Accounts</SubHead>
          }
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
