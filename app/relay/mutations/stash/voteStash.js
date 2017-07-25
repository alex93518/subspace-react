import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation voteStashMutation($input: voteStashInput! $sort: String!) {
    voteStash(input: $input) {
      clientMutationId
      stash {
        votes (first: 9999) {
          totalVotePoints
        }
        acceptVotes {
          totalVotePoints
        }
        rejectVotes {
          totalVotePoints
        }
        ...StashComment_stashComment
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
