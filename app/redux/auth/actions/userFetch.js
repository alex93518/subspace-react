import { graphql } from 'react-relay';
import { network } from 'relay/RelayEnvironment';

export const getUserName = userId => {
  const query = graphql`
    query userFetchQuery($userId: String!) {
      viewer {
        user(id: $userId) {
          id
          userName
          fullName
          photoUrl
        }
      }
    }
  `;
  return network.fetch(query(), { userId });
};
