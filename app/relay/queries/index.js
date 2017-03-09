import Relay from 'react-relay';

export const viewerQuery = {
  viewer: () => Relay.QL`query {
    viewer
  }`,
};

export const userByNameQuery = {
  userByUserName: () => Relay.QL`query {
    userByUserName(userName: $userName)
  }`,
};

export const userNameQuery = userId => Relay.createQuery(
  Relay.QL `query User($userId: String!) {
    user(id: $userId) {
      userName
    }
  }`,
  { userId },
)
