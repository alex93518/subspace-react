import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';
import ProviderLink from './ProviderLink';
import {
  UserPanel, UserIcon, RowInfoPanel, HeadUserName,
  SubHead, NameSeparator,
} from './styles';

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
