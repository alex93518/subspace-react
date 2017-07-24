import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation addStashCommentMutation($input: AddStashCommentInput!) {
    addStashComment(input: $input) {
      clientMutationId
    }
  }
`;

export const addStashCommentMutation = ({
  content, stashId, parentId, ...rest
}) => commitMutation(
  env,
  {
    mutation,
    variables: { input: { content, stashId, parentId: parentId || null } },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  },
);
