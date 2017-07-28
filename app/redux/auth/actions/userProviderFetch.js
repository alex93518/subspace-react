import { graphql } from 'react-relay';
import { network } from 'relay/RelayEnvironment';

export const getUserProvider = (providerId, provider, firebaseId) => {
  const query = graphql`
    query userProviderFetchQuery(
      $providerId: String, $provider: String!, $firebaseId: String
    ) {
      viewer {
        userProvider(
          providerId: $providerId,
          provider: $provider,
          firebaseId: $firebaseId
        ) {
          userId
        }
      }
    }
  `;
  return network.fetch(query(), { providerId, provider, firebaseId });
};
