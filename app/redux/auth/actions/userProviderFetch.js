import { graphql } from 'react-relay';
import { network } from 'relay/RelayEnvironment';

export const getUserProvider = firebaseId => {
  const query = graphql`
    query userProviderFetchQuery(
      $firebaseId: String
    ) {
      viewer {
        userProvider(
          firebaseId: $firebaseId
        ) {
          userId
          userName
          firebaseToken
        }
      }
    }
  `;
  return network.fetch(query(), { firebaseId });
};
