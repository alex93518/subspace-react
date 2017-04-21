import React from 'react';
import Relay from 'react-relay';
import Helmet from 'react-helmet';
import MainGrid from 'components/shared/MainGrid';
import Profile from './Profile';

export const UserProfile = ({ viewer }) => !viewer ? null : (
  <MainGrid>
    <Helmet
      title={viewer.actor.fullName}
      meta={[{
        name: 'description',
        content: `${viewer.actor.fullName} profile`,
      }]}
    />
    <Profile user={viewer.actor} />
  </MainGrid>
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
