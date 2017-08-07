import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState } from 'recompose';
import { firebaseDb } from 'utils/firebase';
import { Image } from 'react-bootstrap';
import { SpanPresence, SpanContainer, UserIcon } from './styles';

class UserPhoto extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    if (this.presenceRef !== null) {
      firebaseDb.ref(`users-presence/${this.props.userName}`).on('value', snapshot => {
        const user = snapshot.val()
        if (this.presenceRef !== null && user) {
          this.props.updateIsUserOnline(true)
        } else {
          this.props.updateIsUserOnline(false)
        }
      });
    }
  }

  componentWillUnmount() {
    // TODO: remove db ref on componentWillMount to remove the following warning:
    // Warning: setState(...): Can only update a mounted ...
  }

  render() {
    const { isUserOnline, photoUrl, userName, updateIsUserOnline, ...rest } = this.props;
    return (
      <SpanContainer
        ref={el => { this.presenceRef = el }}
        data-isOnline={isUserOnline}
        data-height={rest.height + 10 || 32}
        data-width={rest.width + 10 || 32}
      >
        <SpanPresence
          data-height={rest.height + 4 || 28}
          data-width={rest.width + 4 || 28}
        >
          {
            photoUrl ?
              <Image
                {...rest}
                alt={`@${userName}`}
                src={photoUrl}
                width={rest.width || 24}
                height={rest.height || 24}
                circle
              /> :
              <UserIcon {...rest} />
          }
        </SpanPresence>
      </SpanContainer>
    )
  }
}

UserPhoto.propTypes = {
  photoUrl: PropTypes.string,
  userName: PropTypes.string.isRequired,
  isUserOnline: PropTypes.bool.isRequired,
  updateIsUserOnline: PropTypes.func.isRequired,
}

export default compose(
  withState('isUserOnline', 'updateIsUserOnline', false),
)(UserPhoto);
