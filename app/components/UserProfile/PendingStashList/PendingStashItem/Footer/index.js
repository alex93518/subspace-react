import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { compose, withHandlers } from 'recompose';
import withRelayFragment from 'relay/withRelayFragment';
import { Button } from 'react-bootstrap';
import { setStashIsOnlineMutation } from 'relay';

const Footer = ({ publishStash }) => (
  <div style={{ textAlign: 'right' }}>
    <Button style={{ marginRight: '10px' }}>Update</Button>
    <Button onClick={publishStash}>Publish</Button>
  </div>
)

Footer.propTypes = {
  publishStash: PropTypes.func.isRequired,
}

export default compose(
  withRelayFragment({
    pendingStashItem: graphql`
      fragment Footer_pendingStashItem on Ref {
        stash {
          rawId
        }
      }
    `,
  }),
  withHandlers({
    publishStash: props => () => {
      setStashIsOnlineMutation({
        stashId: props.pendingStashItem.stash.rawId,
        isOnline: true,
      })
    },
  })
)(Footer)
