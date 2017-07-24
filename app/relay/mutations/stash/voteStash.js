import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation voteStashMutation($input: voteStashInput!) {
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
    variables: { input: { isVoteUp, stashId } },
    onCompleted: rest.onCompleted || (() => null),
    onError: rest.onError || (err => console.error(err)),
  },
);
