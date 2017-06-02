import Relay from 'react-relay/classic';

export const viewerQuery = {
  viewer: () => Relay.QL` query { viewer }`,
};

export const userNameQuery = userId => Relay.createQuery(
  Relay.QL `query User($userId: String!) {
    viewer {
      user(id: $userId) {
        id
        userName
        fullName
        photoUrl
      }
    }
  }`,
  { userId },
)

export const userProviderQuery = (
  providerId, provider, firebaseId
) => Relay.createQuery(
  Relay.QL `
    query UserProvider(
      $providerId: String, $provider: String!, $firebaseId: String
    ) {
      viewer {
        userProvider(
          providerId: $providerId,
          provider: $provider,
          firebaseId: $firebaseId
        ) {
          userId
        }
      }
    }
  `,
  { providerId, provider, firebaseId }
)
