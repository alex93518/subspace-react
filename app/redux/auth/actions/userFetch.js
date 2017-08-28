import { graphql } from 'react-relay';
import { network } from 'relay/RelayEnvironment';

export const getUser = firebaseId => {
  const query = graphql`
    query userFetchQuery($firebaseId: String!) {
      viewer {
        user(firebaseId: $firebaseId) {
          id
          userName
          fullName
          photoUrl
          isInvisible
        }
        accessToken,
        firebaseToken,
      }
    }
  `;
  return network.fetch(query(), { firebaseId });
};
