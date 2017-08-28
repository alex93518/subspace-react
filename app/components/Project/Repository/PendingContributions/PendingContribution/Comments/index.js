import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import MdComment from 'react-icons/lib/md/comment';
import pluralize from 'pluralize';
import Card, { CardHeader, CardContent } from 'components/shared/Card';
import StashComment from './StashComment';

pluralize.addIrregularRule('is', 'are')

const Comments = ({ stash, totalAllCount }) => (
  <Card style={{ marginTop: 10 }}>
    <CardHeader
      title="Comments"
      subheader={(
        <span>
          There{' '}
          {pluralize('is', totalAllCount)}{' '}
          {pluralize('comment', totalAllCount, true)}
        </span>
      )}
      avatar={<MdComment height={32} width={32} />}
    />
    <CardContent>
      <StashComment stash={stash} />
    </CardContent>
  </Card>
)

Comments.propTypes = {
  stash: PropTypes.object.isRequired,
  totalAllCount: PropTypes.number.isRequired,
}

export default compose(
  withRelayFragment({
    stash: graphql`
      fragment Comments_stash on Stash {
        id
        rawId
        totalComments: comments {
          totalAllCount
        }
        ...StashComment_stash
      }
    `,
  }),
  mapProps(props => {
    const { stash: { totalComments: { totalAllCount } } } = props
    return {
      totalAllCount: totalAllCount || 0,
      ...props,
    }
  })
)(Comments)
