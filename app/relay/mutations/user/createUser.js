import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation createUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
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

export const createUserMutation = ({
  userName,
  fullName,
  photoUrl,
  emailAddress,
  password,
  provider,
  providerId,
  firebaseId,
  accessToken,
}) => {
  const input = {
    userName,
    fullName: fullName || null,
    photoUrl: photoUrl || null,
    emailAddress: emailAddress || null,
    password,
    provider,
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
