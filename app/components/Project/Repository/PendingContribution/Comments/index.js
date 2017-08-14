import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import MdComment from 'react-icons/lib/md/comment';
import pluralize from 'pluralize';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import StashComment from 'components/Project/Repository/Stash/StashComment';

pluralize.addIrregularRule('is', 'are')

const Comments = ({ pendingRefStash, totalAllCount }) => (
  <Card style={{ marginTop: 10 }}>
    <CardHeader
      title="Comments"
      subtitle={(
        <span>
          There{' '}
          {pluralize('is', totalAllCount)}{' '}
          {pluralize('comment', totalAllCount, true)}
        </span>
      )}
      avatar={<MdComment height={32} width={32} />}
      showExpandableButton
      actAsExpander
    />
    <CardText expandable>
      <StashComment stashComment={pendingRefStash} />
    </CardText>
  </Card>
)

Comments.propTypes = {
  pendingRefStash: PropTypes.object.isRequired,
  totalAllCount: PropTypes.number.isRequired,
}

export default compose(
  withRelayFragment({
    pendingRefStash: graphql`
      fragment Comments_pendingRefStash on Stash {
        id
        rawId
        totalComments: comments {
          totalAllCount
        }
        ...StashComment_stashComment
      }
    `,
  }),
  mapProps(props => {
    const { pendingRefStash: { totalComments: { totalAllCount } } } = props
    return {
      totalAllCount: totalAllCount || 0,
      ...props,
    }
  })
)(Comments)
