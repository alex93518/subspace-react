import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { compose, withHandlers } from 'recompose';
import withRelayFragment from 'relay/withRelayFragment';
import { Button } from 'react-bootstrap';
import { setStashIsOnlineMutation } from 'relay';
import { connect } from 'react-redux';
import { submit } from 'redux-form';

const Footer = ({ pendingStashItem: { id }, publishStash, dispatch }) => (
  <div style={{ textAlign: 'right' }}>
    <Button
      style={{ marginRight: '10px' }}
      onClick={() => dispatch(submit(`stashForm${id}`))}
    >
      Update
    </Button>
    <Button onClick={publishStash}>Publish</Button>
  </div>
)

Footer.propTypes = {
  pendingStashItem: PropTypes.object.isRequired,
  publishStash: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default compose(
  withRelayFragment({
    pendingStashItem: graphql`
      fragment Footer_pendingStashItem on Ref {
        id
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
  }),
  connect()
)(Footer)
