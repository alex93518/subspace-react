import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation voteStashMutation($input: voteStashInput!, $sort: String!) {
    voteStash(input: $input) {
      clientMutationId
      stash {
        ...Votes_stash
        ...StashComment_stash
      }
    }
  }
`;

export const voteStashMutation = ({
  isVoteUp, stashId, ...rest
}) => commitMutation(
  env,
  {
    mutation,
    variables: { input: { isVoteUp, stashId }, sort: 'popular' },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  },
);
