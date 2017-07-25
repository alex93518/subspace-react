import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation addStashCommentMutation($input: AddStashCommentInput!, $sort: String!) {
    addStashComment(input: $input) {
      clientMutationId
      stash {
        ...StashComment_stashComment
      }
    }
  }
`;

export const addStashCommentMutation = ({
  content, stashId, parentId, sort, ...rest
}) => commitMutation(
  env,
  {
    mutation,
    variables: { input: { content, stashId, parentId: parentId || null }, sort },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  }
);
