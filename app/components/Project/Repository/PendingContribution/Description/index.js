import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import moment from 'moment';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import UserPhoto from 'components/shared/UserPhoto';

const Description = ({
  title, children,
  pendingRef: {
    stash: { description, owner, createdAt },
  },
}) => (
  <Card>
    <CardHeader
      title={title}
      subtitle={`pushed ${moment(createdAt).fromNow()}`}
      avatar={(
        <Avatar>
          <UserPhoto
            userName={owner.userName}
            photoUrl={owner.photoUrl}
            width={32}
            height={32}
          />
        </Avatar>
      )}
      showExpandableButton
      actAsExpander
      style={{
        backgroundColor: '#0091EA',
      }}
      iconStyle={{
        color: 'rgba(255,255,255,0.9)',
      }}
      titleColor={'rgba(255,255,255,0.9)'}
      subtitleColor={'rgba(255,255,255,0.7)'}
    />
    <CardText expandable style={{ color: 'rgba(0,0,0,0.78)' }}>
      {description && (
        <dl>
          <dt>Description</dt>
          <dd>
            {description}
          </dd>
        </dl>
      )}
      <dl>
        <dt>Goals &amp; Issues</dt>
        <dd>TODO</dd>
      </dl>
      <dl>
        <dt>Contributor Statistics</dt>
        <dd>TODO</dd>
      </dl>
      {children}
    </CardText>
  </Card>
)

Description.propTypes = {
  pendingRef: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}

export default compose(
  withRelayFragment({
    pendingRef: graphql`
      fragment Description_pendingRef on Ref {
        id
        stash {
          stashNum
          title
          description
          createdAt
          owner {
            userName
            photoUrl
          }
        }
      }
    `,
  }),
  mapProps(({
    pendingRef: { stash: { stashNum, title } },
    pendingRef, ...rest
  }) => ({
    title: title ?
      `${title} (Stash #${stashNum})` : `Stash #${stashNum}`,
    pendingRef,
    ...rest,
  }))
)(Description)
