import { commitMutation, graphql } from 'react-relay';
import { network, env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation createUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      clientMutationId,
      firebaseToken,
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
  password,
  provider,
  isNetwork,
  firebaseId,
  ...rest
}) => {
  const input = {
    firebaseId,
    userName,
    fullName: rest.fullName || null,
    photoUrl: rest.photoUrl || null,
    emailAddress: rest.emailAddress || null,
    password,
    provider,
    providerId: rest.providerId || null,
    accessToken: rest.accessToken || null,
  };

  if (isNetwork) {
    return network.fetch(mutation(), { input });
  }

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
