import Relay from 'react-relay';

export const viewerQuery = {
  viewer: (Component, vars) => {
    const initVars = {
      branchHead: 'master',
      userName: null,
      projectName: null,
      isMainPage: false,
      isTreePage: false,
      isBlobPage: false,
      isCommitsPage: false,
      splat: '',
    }
    const retVars = {
      ...initVars,
      ...vars,
    }
    return (Relay.QL`query {
      viewer {
        ${Component.getFragment('viewer', retVars)}
      }
    }`)
  },
};

export const userNameQuery = userId => Relay.createQuery(
  Relay.QL `query User($userId: String!) {
    viewer {
      user(id: $userId) {
        id
      }
    }
  }`,
  { userId },
)
