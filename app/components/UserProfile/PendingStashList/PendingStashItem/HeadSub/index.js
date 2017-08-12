import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import { AddMetaDiv, ReadyPublishDiv, IconWarning } from './styles'

const HeadSub = ({ isMetaUpdated }) => (
  <div>
    {
      isMetaUpdated ?
        <ReadyPublishDiv>Ready to published</ReadyPublishDiv> :
        <AddMetaDiv>
          <IconWarning />
          Help people to understand this push better by adding a title and a description
        </AddMetaDiv>
    }
  </div>
)

HeadSub.propTypes = ({
  isMetaUpdated: PropTypes.bool.isRequired,
})

export default compose(
  withRelayFragment({
    stash: graphql`
      fragment HeadSub_stash on Stash {
        title
        description
      }
    `,
  }),
  mapProps(props => {
    const { stash: { title, description } } = props
    const isMetaUpdated = !!((title && description))
    return {
      isMetaUpdated,
      ...props,
    }
  })
)(HeadSub);
