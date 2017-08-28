import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation voteStashCommentMutation($input: voteStashCommentInput!, $sort: String!) {
    voteStashComment(input: $input) {
      clientMutationId
      stash {
        ...StashComment_stash
      }
    }
  }
`;

export const voteStashCommentMutation = ({
  isVoteUp, stashCommentId, stashId, ...rest
}) => commitMutation(
  env,
  {
    mutation,
    variables: { input: { isVoteUp, stashCommentId, stashId }, sort: 'popular' },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  },
);
