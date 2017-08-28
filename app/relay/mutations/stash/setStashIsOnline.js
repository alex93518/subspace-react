import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation setStashIsOnlineMutation($input: SetStashIsOnlineInput!) {
    setStashIsOnline(input: $input) {
      clientMutationId
      ref {
        ...PendingStashItem_gitRef
      }
    }
  }
`;

export const setStashIsOnlineMutation = ({
  stashId, isOnline, ...rest
}) => commitMutation(
  env,
  {
    mutation,
    variables: { input: { stashId, isOnline } },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  },
);
