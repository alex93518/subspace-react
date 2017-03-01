import Relay from 'react-relay';

export const viewerQuery = { viewer: () => Relay.QL`query { viewer }` };
export const userByNameQuery = { userByUserName:
  () => Relay.QL`query { userByUserName(userName: $userName) }`,
};
