import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, withHandlers } from 'recompose';
import { firebaseDb } from 'utils/firebase';
import { OverlayTrigger, NavItem } from 'react-bootstrap';
import FaClose from 'react-icons/lib/fa/close';
import {
  NotifSpan, NotifCircle,
  NotifIcon, NotifPopover, NotifTable,
} from './styles';

class Notifications extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    if (this.unreadRef !== null) {
      firebaseDb.ref(`notificationsMeta/${this.props.userName}`).on('value', snapshot => {
        const data = snapshot.val()
        if (this.unreadRef !== null && data) {
          this.props.updateIsUnread(data.unread)
        }
      });

      firebaseDb.ref(`notifications/${this.props.userName}`).on('value', snapshot => {
        const data = snapshot.val()
        if (data) {
          const notifications = []
          const notificationsIdx = []
          Object.keys(data).forEach(key => {
            if (this.unreadRef !== null && data[key]) {
              notifications.splice(0, 0, { key, ...data[key] })
              this.props.updateNotifications(notifications)

              notificationsIdx.splice(0, 0, key)
              this.props.updateNotificationsIdx(notificationsIdx)
            }
          })
        } else {
          this.props.updateNotifications([])
          this.props.updateNotificationsIdx([])
        }
      });
    }
  }

  componentWillUnmount() {
    firebaseDb.ref(`notificationsMeta/${this.props.userName}`).off()
    firebaseDb.ref(`notifications/${this.props.userName}`).off()
  }

  render() {
    const { notifications, isUnread, markAsRead, userName, removeNotif } = this.props
    return (
      <OverlayTrigger
        onClick={markAsRead}
        trigger="click"
        placement="bottom"
        overlay={
          <NotifPopover id="popoverNotif">{
            notifications.length ?
              <NotifTable striped>
                <tbody>
                  {
                  notifications && notifications.map(notif => (
                    <tr key={notif.key}>
                      <td>
                        {
                          notif.operation === 'stashReview' ?
                            <a href={`/profile/${userName}`}>
                              {notif.message}
                            </a> : notif.message
                        }
                      </td>
                      <td>
                        <FaClose
                          role="button"
                          onClick={() => removeNotif(notif.key)}
                        />
                      </td>
                    </tr>
                    ))
                  }
                </tbody>
              </NotifTable>
              : <div>No notifications</div>
          }</NotifPopover>
        }
        rootClose
      >
        <NavItem>
          <NotifSpan>
            <NotifCircle
              data-isUnread={isUnread}
            />
            <NotifIcon
              width={24}
              height={24}
              data-isUnread={isUnread}
              ref={el => { this.unreadRef = el }}
            />
          </NotifSpan>
        </NavItem>
      </OverlayTrigger>
    )
  }
}

Notifications.propTypes = {
  userName: PropTypes.string.isRequired,
  isUnread: PropTypes.bool.isRequired,
  updateIsUnread: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired,
  updateNotifications: PropTypes.func.isRequired,
  updateNotificationsIdx: PropTypes.func.isRequired,
  markAsRead: PropTypes.func.isRequired,
  removeNotif: PropTypes.func.isRequired,
}

export default compose(
  withState('isUnread', 'updateIsUnread', false),
  withState('notifications', 'updateNotifications', []),
  withState('notificationsIdx', 'updateNotificationsIdx', []),
  withHandlers({
    markAsRead: props => () => {
      firebaseDb.ref(`notificationsMeta/${props.userName}/unread`).set(false)
    },
    removeNotif: props => key => {
      firebaseDb.ref(`notifications/${props.userName}/${key}`).remove()
    },
  })
)(Notifications);
