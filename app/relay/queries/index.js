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
      }
    }
  }`,
  { userId },
)
