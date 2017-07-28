import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation mergeStashMutation($input: MergeStashInput!) {
    mergeStash(input: $input) {
      clientMutationId
    }
  }
`;

export const mergeStashMutation = ({
  repositoryId, stashName, ...rest
}) => commitMutation(
  env,
  {
    mutation,
    variables: { input: { repositoryId, stashName } },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  },
);
