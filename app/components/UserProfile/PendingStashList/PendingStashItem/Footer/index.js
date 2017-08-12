import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { compose, withHandlers } from 'recompose';
import withRelayFragment from 'relay/withRelayFragment';
import RaisedButton from 'material-ui/RaisedButton';
import { setStashIsOnlineMutation } from 'relay';
import { connect } from 'react-redux';
import { submit, isPristine } from 'redux-form/immutable';
import styled from 'styled-components';

const FooterDiv = styled.div`
  text-align: right;
`

const Footer = ({ pendingStashItem: { id }, publishStash, dispatch, isFormPristine }) => (
  <FooterDiv>
    <RaisedButton
      primary
      label="Update"
      disabled={isFormPristine}
      style={{ marginRight: '10px' }}
      onClick={() => dispatch(submit(`stashForm${id}`))}
    />
    <RaisedButton
      primary
      label="Publish"
      onClick={publishStash}
    />
  </FooterDiv>
)

Footer.propTypes = {
  pendingStashItem: PropTypes.object.isRequired,
  publishStash: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  isFormPristine: PropTypes.bool.isRequired,
}

function mapStateToProps(state, ownProps) {
  const formId = `stashForm${ownProps.pendingStashItem.id}`
  const isFormPristine = isPristine(formId)(state)
  return {
    isFormPristine,
  };
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
  connect(mapStateToProps)
)(Footer)
