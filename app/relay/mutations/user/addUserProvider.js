import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation addUserProviderMutation($input: AddUserProviderInput!) {
    addUserProvider(input: $input) {
      clientMutationId,
      user {
        id
        rawId
        userName
        fullName
        photoUrl
        providerAccounts(first: 10) {
          edges {
            node {
              userName
              provider
              providerId
            }
          }
        }
      }
    }
  }
`;

export const addUserProviderMutation = ({
  userId,
  provider,
  userName,
  providerId,
  firebaseId,
  accessToken,
}) => {
  const input = {
    userId,
    provider,
    userName,
    providerId: providerId || null,
    firebaseId: firebaseId || null,
    accessToken: accessToken || null,
  };

  return commitMutation(
    env,
    {
      mutation,
      variables: { input },
      onError: err => console.error(err),
    },
  );
};
