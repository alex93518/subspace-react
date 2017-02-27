import Relay from 'react-relay';

export const projectsQuery = { projects: () => Relay.QL`query { projects }` };
export const userByNameQuery = { userByUserName: () => Relay.QL`query { userByUserName(userName: $userName) }` };
