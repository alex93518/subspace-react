import Relay from 'react-relay';

export const viewerQuery = {
  viewer: (Component, vars) => {
    let retVars;
    if (vars.splat) {
      retVars = vars
    } else if (vars.branchHead) {
      retVars = {
        ...vars,
        splat: '',
        treeOrBlob: 'tree',
      }
    } else {
      retVars = {
        ...vars,
        splat: '',
        treeOrBlob: 'tree',
        branchHead: 'master',
      }
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
