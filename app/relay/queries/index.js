import Relay from 'react-relay';

export const UserByUserNameQueries = { userByUserName: (userName) => Relay.QL`query { userByUserName(userName: ${userName}) }` };
export const ProjectsQueries = { projects: (pageStart, pageEnd) => Relay.QL`query { projects(pageStart: ${pageStart}, pageEnd: ${pageEnd})}` };
