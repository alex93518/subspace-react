import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import pluralize from 'pluralize';
import { Card, CardText, CardHeader } from 'material-ui/Card';
import { parseDiff, totalHunk } from 'utils/diff'
import GoGitCommit from 'react-icons/lib/go/git-commit';
import Commit from 'components/Project/Repository/Commits/CommitList/Commit';
import {
  TableCommit, SpanTotalAdditions, SpanTotalDeletions,
} from './styles';

pluralize.addIrregularRule('is', 'are')

const Commits = ({
  totalCommits, totalAdditions, totalDeletions,
  commit: { history },
}) => (
  <Card style={{ marginTop: 10 }}>
    <CardHeader
      title="Commits"
      subtitle={(
        <span>
          There{' '}
          {pluralize('is', totalCommits)}{' '}
          {pluralize('commit', totalCommits, true)}{' with '}
          <SpanTotalAdditions>{totalAdditions}</SpanTotalAdditions>{' '}
          {pluralize('addition', totalAdditions)}{' and '}
          <SpanTotalDeletions>{totalDeletions}</SpanTotalDeletions>{' '}
          {pluralize('deletion', totalDeletions)}
        </span>
      )}
      avatar={<GoGitCommit height={32} width={32} />}
      showExpandableButton
      actAsExpander
    />
    <CardText expandable>
      <TableCommit>
        <tbody>
          {
            history.edges.map(({ node }) =>
              <Commit isHideAvatar commit={node} key={node.id} />
            )
          }
        </tbody>
      </TableCommit>
    </CardText>
  </Card>
)

Commits.propTypes = {
  commit: PropTypes.object.isRequired,
  totalCommits: PropTypes.number.isRequired,
  totalAdditions: PropTypes.number.isRequired,
  totalDeletions: PropTypes.number.isRequired,
}

export default compose(
  withRelayFragment({
    commit: graphql`
      fragment Commits_commit on Commit {
        history(first: 9999, isStash: true) {
          edges {
            node {
              id
              diff {
                diff
              }              
              ...Commit_commit
            }
          }
        }
      }
    `,
  }),
  mapProps(props => {
    const { commit: { history: { edges } } } = props
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
