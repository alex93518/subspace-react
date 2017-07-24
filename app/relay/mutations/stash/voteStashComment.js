import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation voteStashCommentMutation($input: voteStashCommentInput!) {
    voteStashComment(input: $input) {
      clientMutationId
    }
  }
`;

export const voteStashCommentMutation = ({
  isVoteUp, stashCommentId, stashId, ...rest
}) => commitMutation(
  env,
  {
    mutation,
    variables: { input: { isVoteUp, stashCommentId, stashId } },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  },
);
