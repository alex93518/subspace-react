import React from 'react'
import Relay from 'react-relay/classic'
import Helmet from 'react-helmet'
// import { QueryRenderer, graphql } from 'react-relay/compat'
// import CurrentRelay, { withQueryRenderer } from 'relay'
import MainGrid from 'components/shared/MainGrid'
import ProjectList from 'components/Projects/ProjectList'
import Profile from './Profile'

export const UserProfile = ({ viewer }) => !viewer ? null : (
  <MainGrid>
    <Helmet
      title={viewer.user.fullName}
      meta={[{
        name: 'description',
        content: `${viewer.user.fullName} profile`,
      }]}
    />
    <Profile user={viewer.user} accessToken={viewer.actor.accessToken}>
      <h3>Projects</h3>
      <ProjectList viewer={viewer} owner={viewer.user.userName} />
    </Profile>
  </MainGrid>
)

UserProfile.propTypes = {
  viewer: React.PropTypes.object,
};

export default Relay.createContainer(UserProfile, {
  initialVariables: {
    userName: null,
  },
  fragments: {
    viewer: ({ userName }) => Relay.QL`
      fragment on Viewer {
        user(login: $userName) {
          userName
          fullName
          ${Profile.getFragment('user')}
        }
        ${ProjectList.getFragment('viewer', { owner: userName })}
        actor {
          accessToken
        }
      }
    `,
  },
})

// export default withQueryRenderer({
//   query: graphql`
//     query indexQuery($login: String) {
//       viewer {
//         user(login: $login) {
//           userName
//           fullName
//           photoUrl
//         }
//       }
//     }
//   `,
// })(UserProfile)
