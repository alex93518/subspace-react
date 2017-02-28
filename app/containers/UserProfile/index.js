import React from 'react';
import Relay from 'react-relay';
import Helmet from 'react-helmet';
import Profile from '../../components/users/Profile';

export class UserProfile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const user = this.props.userByUserName;
    return (
      <div>
        <Helmet
          title={user.fullName}
          meta={[{ name: 'description', content: `${user.fullName} profile` }]}
        />
        <Profile user={user} />
      </div>
    );
  }
}

UserProfile.propTypes = {
  userByUserName: React.PropTypes.object,
};

export default Relay.createContainer(
  UserProfile,
  {
    fragments: {
      userByUserName: () => Relay.QL`
        fragment on User {
          id
          userName
          fullName
          photoUrl
        }
      `,
    },
  },
);
