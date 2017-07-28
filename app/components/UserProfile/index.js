import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { QueryRenderer, graphql } from 'react-relay';
import MainGrid from 'components/shared/MainGrid';
import ProjectList from 'components/Projects/ProjectList';
import { env } from 'relay/RelayEnvironment';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import Profile from './Profile';

export const UserProfile = ({ match: { params: { userName } } }) => (
  <MainGrid>
    <QueryRenderer
      environment={env}
      variables={{ userName, owner: userName }}
      query={query}
      render={({ props }) => {
        if (props) {
          const { viewer } = props;
          return (
            <div>
              <Helmet
                title={viewer.user.fullName}
                meta={[{
                  name: 'description',
                  content: `${viewer.user.fullName} profile`,
                }]}
              />
              <Profile
                user={viewer.user}
                accessToken={viewer.accessToken}
                isOwner={viewer.me ? viewer.me.userName === viewer.user.userName : false}
              >
                <ProjectList viewer={viewer} owner={viewer.user.userName} />
              </Profile>
            </div>
          );
        }
        return <LoadingIndicator />;
      }}
    />

  </MainGrid>
);

UserProfile.propTypes = {
  viewer: PropTypes.object,
  match: PropTypes.object.isRequired,
};

const query = graphql`
  query UserProfileQuery($userName: String!, $owner: String!) {
    viewer {
      user (login: $userName) {
        fullName
        userName
        ...Profile_user
      }
      me: user {
        userName
      }
      accessToken
      ...ProjectList_viewer
    }
  }
`;

export default UserProfile;
