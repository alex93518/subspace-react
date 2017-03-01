import React from 'react';
import Relay from 'react-relay';
import Helmet from 'react-helmet';
import Profile from '../../components/users/Profile';

export const UserProfile = ({ viewer }) => (
  <div>
    <Helmet
      title={viewer.fullName}
      meta={[{
        name: 'description',
        content: `${viewer.fullName} profile`,
      }]}
    />
    <Profile user={viewer} />
  </div>
)

UserProfile.propTypes = {
  viewer: React.PropTypes.object,
};

export default Relay.createContainer(UserProfile, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on ViewerQuery {
        userName
        fullName
        photoUrl
      }
    `,
  },
});
