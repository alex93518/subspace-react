import React from 'react';
import Relay from 'react-relay';
import Helmet from 'react-helmet';
import MainGrid from 'components/shared/MainGrid';
import ProjectList from 'components/Projects/ProjectList'
import Profile from './Profile';

export const UserProfile = ({ viewer }) => !viewer ? null : (
  <MainGrid>
    <Helmet
      title={viewer.user.fullName}
      meta={[{
        name: 'description',
        content: `${viewer.user.fullName} profile`,
      }]}
    />
    <Profile viewer={viewer} />
  </MainGrid>
)

UserProfile.propTypes = {
  viewer: React.PropTypes.object,
};

export default Relay.createContainer(UserProfile, {
  initialVariables: {
    login: null,
  },
  fragments: {
    viewer: ({ login: owner }) => Relay.QL`
      fragment on Viewer {
        user(login: $login) {
          userName
          fullName
          photoUrl
        }
        ${ProjectList.getFragment('viewer', { owner })}
      }
    `,
  },
});
