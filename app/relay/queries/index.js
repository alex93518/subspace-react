import Relay from 'react-relay/classic';

export const viewerQuery = {
  viewer: (Component, vars) => Relay.QL`
    query {
      viewer {
        ${Component.getFragment('viewer', vars)}
      }
    }
  `,
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
