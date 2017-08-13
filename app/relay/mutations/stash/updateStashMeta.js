import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation updateStashMetaMutation($input: UpdateStashMetaInput!) {
    updateStashMeta(input: $input) {
      clientMutationId
      stash {
        id
        title
        description
      }
    }
  }
`;

export const updateStashMetaMutation = ({
  stashId, title, description, ...rest
}) => commitMutation(
  env,
  {
    mutation,
    variables: { input: { stashId, title, description } },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  },
);
