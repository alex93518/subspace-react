import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Row, Col, OverlayTrigger, Button, Popover, Glyphicon } from 'react-bootstrap';
import styled from 'styled-components';

const CloneUrlBox = ({
  cloneUrlBox: { url },
}) => (
  <Popover id="popover-positioned-bottom">
    {url}
  </Popover>
)

CloneUrlBox.propTypes = {
  cloneUrlBox: PropTypes.object.isRequired,
}

export default Relay.createContainer(CloneUrlBox, {
  fragments: {
    cloneUrlBox: () => Relay.QL`
      fragment on Repository {
        url
      }
    `,
  },
})
