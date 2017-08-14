import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import pluralize from 'pluralize';
import { Card, CardText } from 'material-ui/Card';
import { parseDiff, totalHunk } from 'utils/diff'
import Commit from 'components/Project/Repository/Commits/CommitList/Commit';
import {
  TableCommit, CommitStatDiv, SpanTotalAdditions, SpanTotalDeletions,
} from './styles';

pluralize.addIrregularRule('is', 'are')

const Commits = ({
  totalCommits, totalAdditions, totalDeletions,
  pendingCommits: { history },
}) => (
  <Card style={{ marginTop: 10 }}>
    <CardText>
      <CommitStatDiv>
        There{' '}
        {pluralize('is', totalCommits)}{' '}
        {pluralize('commit', totalCommits, true)}{' with '}
        <SpanTotalAdditions>{totalAdditions}</SpanTotalAdditions>{' '}
        {pluralize('addition', totalAdditions)}{' and '}
        <SpanTotalDeletions>{totalDeletions}</SpanTotalDeletions>{' '}
        {pluralize('deletion', totalDeletions)}
      </CommitStatDiv>
      <TableCommit>
        <tbody>
          {
            history.edges.map(({ node }) =>
              <Commit isHideAvatar commitItem={node} key={node.id} />
            )
          }
        </tbody>
      </TableCommit>
    </CardText>
  </Card>
)

Commits.propTypes = {
  pendingCommits: PropTypes.object.isRequired,
  totalCommits: PropTypes.number.isRequired,
  totalAdditions: PropTypes.number.isRequired,
  totalDeletions: PropTypes.number.isRequired,
}

export default compose(
  withRelayFragment({
    pendingCommits: graphql`
      fragment Commits_pendingCommits on Commit {
        history(first: 9999, isStash: true) {
          edges {
            node {
              id
              diff {
                diff
              }              
              ...Commit_commitItem
            }
          }
        }
      }
    `,
  }),
  mapProps(props => {
    const { pendingCommits: { history: { edges } } } = props
    const totalCommits = edges.length;
    let totalAdditions = 0;
    let totalDeletions = 0;
    edges.forEach(({ node }) => {
      const diff = parseDiff(node);
      totalAdditions += totalHunk('additions', diff)
      totalDeletions += totalHunk('deletions', diff)
    })
    return {
      totalCommits,
      totalAdditions,
      totalDeletions,
      ...props,
    }
  })
)(Commits)
