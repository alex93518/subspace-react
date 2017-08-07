import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, ToggleButtonGroup } from 'react-bootstrap';
import { authRelay } from 'relay/RelayEnvironment';
import { connect } from 'react-redux';
import { compose, withHandlers, mapProps } from 'recompose';
import UserPhoto from 'components/shared/UserPhoto';
import FaCog from 'react-icons/lib/fa/cog';
import FaSignOut from 'react-icons/lib/fa/sign-out';
import { redirect } from 'redux/utils'
import {
  NavItemWhite, SpanName, OnlineButton, SpanTitle, UserNameDiv,
  AngleDownName, UserSeparator, UserPopover, SignOutDiv,
} from './styles';

const popoverUser = (userName, photoUrl, isInvisibleIdx, setIsInvisible) => (
  <UserPopover id="popoverUser">
    <ToggleButtonGroup
      type="radio"
      name="options"
      value={isInvisibleIdx}
      onChange={setIsInvisible}
    >
      <OnlineButton value={0}>Online</OnlineButton>
      <OnlineButton value={1}>Invisible</OnlineButton>
    </ToggleButtonGroup>
    <UserSeparator />
    <div
      role="button"
      tabIndex={0}
      onClick={e => {
        redirect(`/profile/${userName}`)
        e.currentTarget.parentNode.parentNode.parentNode.click()
      }}
    >
      <UserPhoto
        userName={userName}
        photoUrl={photoUrl}
        width={24}
        height={24}
      />
      <SpanTitle>View my profile</SpanTitle>
    </div>
    <UserSeparator />
    <div role="button">
      <FaCog width={26} height={26} /><SpanTitle>Settings</SpanTitle>
    </div>
    <UserSeparator />
    <SignOutDiv role="button" onClick={authRelay.signOut.init}>
      <FaSignOut width={26} height={26} /><SpanTitle>Logout</SpanTitle>
      <UserNameDiv>
        {userName}
      </UserNameDiv>
    </SignOutDiv>
  </UserPopover>
);

const User = ({ user, userName, isInvisibleIdx, setIsInvisible }) => (
  <OverlayTrigger
    trigger="click"
    placement="bottom"
    overlay={popoverUser(userName, user.photoUrl, isInvisibleIdx, setIsInvisible)}
    rootClose
  >
    <NavItemWhite eventKey={3}>
      <UserPhoto
        photoUrl={user.photoUrl}
        userName={userName}
        width={22}
        height={22}
      />
      <SpanName>
        {user.displayName}
      </SpanName><AngleDownName />
    </NavItemWhite>
  </OverlayTrigger>
);

User.propTypes = {
  user: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
  isInvisibleIdx: PropTypes.number.isRequired,
  setIsInvisible: PropTypes.func.isRequired,
}

export default compose(
  connect(state => ({
    isInvisible: state.get('auth').get('isInvisible'),
  })),
  mapProps(props => {
    const isInvisibleIdx = props.isInvisible ? 1 : 0
    return { isInvisibleIdx, ...props }
  }),
  withHandlers({
    setIsInvisible: () => idx => {
      if (idx) {
        authRelay.setIsInvisible.init(true)
      } else {
        authRelay.setIsInvisible.init(false)
      }
    },
  })
)(User);
