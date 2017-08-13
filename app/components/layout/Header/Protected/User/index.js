import React from 'react';
import PropTypes from 'prop-types';
import { ToggleButtonGroup } from 'react-bootstrap';
import { authRelay } from 'relay/RelayEnvironment';
import { connect } from 'react-redux';
import { compose, withHandlers, mapProps, withState } from 'recompose';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UserPhoto from 'components/shared/UserPhoto';
import FaCog from 'react-icons/lib/fa/cog';
import FaSignOut from 'react-icons/lib/fa/sign-out';
import { redirect } from 'redux/utils'
import {
  NavItemWhite, SpanName, OnlineButton, SpanTitle, UserNameDiv,
  AngleDownName, UserSeparator, UserPopover, SignOutDiv,
} from './styles';

const User = ({
  handleTouchTap, isUserWidgetOpen, anchorEl, handleRequestClose,
  handleOnProfileClick, user, userName, isInvisibleIdx, setIsInvisible,
}) => (
  <MuiThemeProvider>
    <NavItemWhite
      eventKey={3}
      onClick={handleTouchTap}
    >
      <UserPhoto
        photoUrl={user.photoUrl}
        userName={userName}
        width={22}
        height={22}
      />
      <SpanName>
        {user.displayName}
      </SpanName><AngleDownName />
      <UserPopover
        open={isUserWidgetOpen}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        onRequestClose={handleRequestClose}
        useLayerForClickAway={false}
        style={{ color: 'inherit' }}
      >
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
          onClick={handleOnProfileClick}
        >
          <UserPhoto
            userName={userName}
            photoUrl={user.photoUrl}
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
    </NavItemWhite>
  </MuiThemeProvider>
);

User.propTypes = {
  user: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
  isInvisibleIdx: PropTypes.number.isRequired,
  setIsInvisible: PropTypes.func.isRequired,
  handleTouchTap: PropTypes.func.isRequired,
  isUserWidgetOpen: PropTypes.bool.isRequired,
  handleRequestClose: PropTypes.func.isRequired,
  handleOnProfileClick: PropTypes.func.isRequired,
  anchorEl: PropTypes.object,
}

export default compose(
  withState('isUserWidgetOpen', 'setIsUserWidgetOpen', false),
  withState('anchorEl', 'setAnchorEl', null),
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
    handleTouchTap: props => event => {
      event.preventDefault();
      props.setIsUserWidgetOpen(!props.isUserWidgetOpen);
      props.setAnchorEl(event.currentTarget);
    },
    handleRequestClose: props => () => {
      props.setIsUserWidgetOpen(false);
    },
    handleOnProfileClick: props => () => {
      redirect(`/profile/${props.userName}`);
      props.setIsUserWidgetOpen(false)
    },
  })
)(User);
