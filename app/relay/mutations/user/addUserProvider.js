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
              firebaseId
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
  accessToken,
  firebaseId,
  ...rest
}) => {
  const input = {
    userId,
    provider,
    userName,
    providerId: providerId || null,
    accessToken: accessToken || null,
    firebaseId,
  };

  return commitMutation(
    env,
    {
      mutation,
      variables: { input },
      onCompleted: rest.onCompleted || (() => null),
      onError: rest.onError || (err => console.error(err)),
    },
  );
};
