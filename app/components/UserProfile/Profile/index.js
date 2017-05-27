import React, { PropTypes } from 'react';
import { Panel, Row, Col } from 'react-bootstrap';
import Relay from 'react-relay/classic';
import { createContainer } from 'recompose-relay';
import styled from 'styled-components';
import { compose, withState, lifecycle, mapProps } from 'recompose';
import { getUserInfo } from 'utils/stackexchange';
import StackexRepBadge from './StackexRepBadge';
import StackexInfo from './StackexInfo';

const UserBadge = (isStackexchange, stackexchangeData) => {
  if (isStackexchange) {
    return stackexchangeData && stackexchangeData.items[0] ?
      (<StackexRepBadge
        stackexUser={stackexchangeData.items[0]}
      />) : null
  }

  return (
    <div>
      <div>99 Karma</div>
      <div>99 Skill</div>
      <div>99 Reputation</div>
      <div>Badges</div>
    </div>
  )
}

const UserInfo = (isStackexchange, stackexchangeData) => {
  if (isStackexchange) {
    return stackexchangeData && stackexchangeData.items[0] ?
      (<StackexInfo
        stackexUser={stackexchangeData.items[0]}
      />) : null
  }

  return null
}

const UserPanel = styled(Panel)`
  box-shadow: inset 0 90px 0 #e7e8ea;
  text-align: center;
`

const RowInfoPanel = styled(Row)`
  margin-top: 10px;
`

const HeadUserName = styled.h2`
  margin-top: 0px;
`

const Profile = ({
  user, children, stackexchangeData, isStackexchange,
}) => (
  <div>
    <Row>
      <Col md={3}>
        <UserPanel>
          <img
            alt={user.fullName}
            src={user.photoUrl}
            width={120}
            height={120}
            style={{ marginBottom: 10 }}
          />
          {UserBadge(isStackexchange, stackexchangeData)}
        </UserPanel>
      </Col>
      <Col md={9}>
        <RowInfoPanel>
          <Col md={7}>
            <HeadUserName>{user.fullName}</HeadUserName>
            <h4>Hello World</h4>
            <div>Email: {user.email}</div>
            <div>Stackoverflow:</div>
            <div>Git: </div>
            <div>Linkedin: </div>
            <div>Twitter: </div>
          </Col>
          <Col md={5}>
            {UserInfo(isStackexchange, stackexchangeData)}
          </Col>
        </RowInfoPanel>
      </Col>
    </Row>
    {children && (
      <Row>
        <Col md={12}>
          {children}
        </Col>
      </Row>
    )}
    <Row>
      <Col md={12}>
        <h3>Contributions: TODO</h3>
      </Col>
    </Row>
    <Row>
      <Col md={12}>
        <h3>Client Feedbacks: TODO</h3>
      </Col>
    </Row>
  </div>
  );

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  children: PropTypes.node,
  stackexchangeData: PropTypes.object,
  isStackexchange: PropTypes.bool.isRequired,
}

export default compose(
  createContainer({
    fragments: {
      user: () => Relay.QL`
        fragment on User {
          rawId
          userName
          fullName
          provider
          photoUrl
        }
      `,
    },
  }),
  withState('stackexchangeData', 'updateStackexchange', null),
  mapProps(props => ({
    ...props,
    isStackexchange: props.user.provider === 'stackexchange',
  })),
  lifecycle({
    componentDidMount() {
      if (this.props.user.provider === 'stackexchange') {
        getUserInfo(
          this.props.user.rawId,
          this.props.accessToken
        ).then(
          res => res.json().then(
            data => {
              this.props.updateStackexchange(data)
            }
          )
        )
      }
    },
  })
)(Profile)
