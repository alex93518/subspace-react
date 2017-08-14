import { commitMutation, graphql } from 'react-relay';
import { env } from 'relay/RelayEnvironment';

const mutation = graphql`
  mutation voteStashMutation($input: voteStashInput! $sort: String!) {
    voteStash(input: $input) {
      clientMutationId
      stash {
        ...Votes_pendingRefStash
        stashAcc: acceptVotes (first: 9999) {
          ...UserVoteList_userVoteList
        }
        stashReject: rejectVotes (first: 9999) {
          ...UserVoteList_userVoteList
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
