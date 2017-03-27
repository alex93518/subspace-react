import React from 'react';
import Relay from 'react-relay';
import Helmet from 'react-helmet';
import Profile from './Profile';

export const UserProfile = ({ viewer }) => !viewer ? null : (
  <div>
    <Helmet
      title={viewer.actor.fullName}
      meta={[{
        name: 'description',
        content: `${viewer.actor.fullName} profile`,
      }]}
    />
    <Profile user={viewer.actor} />
  </div>
)

UserProfile.propTypes = {
  viewer: React.PropTypes.object,
};

export default Relay.createContainer(UserProfile, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        actor {
          userName
          fullName
          photoUrl
        }
      }
    `,
  },
});
