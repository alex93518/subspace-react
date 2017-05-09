import React, { PropTypes } from 'react';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { Button, Glyphicon, OverlayTrigger, Popover } from 'react-bootstrap';
import CopyClipboardButton from 'components/shared/CopyClipboardButton';

const PopoverBox = styled(Popover)`
  max-width: 375px;
`

const CloneButton = styled(Button)`
  font-size: 12px;
  color: #fff;
  background-color: #28a745;
  background-image: linear-gradient(-180deg, #34d058 0%, #28a745 90%);
  1px solid rgba(27,31,35,0.2);
  padding: 5px 10px;
  margin-top: 5px;
  border: 1px solid #28a745;
`

const InputUrl = styled.input`
  background-color: #fff;
  line-height: 20px;
  padding: 3px 10px;
  border: 1px solid #d1d5da;
  width: 80%;
`

const CopyBox = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`

const popoverBottom = url => (
  <PopoverBox id="popover-positioned-bottom" title="Clone with Http">
    <div>
      Use Git or checkout with SVN using the web URL.
    </div>
    <CopyBox>
      <InputUrl value={url} readOnly />
      <CopyClipboardButton text={url} />
    </CopyBox>
  </PopoverBox>
);

const CloneUrlBox = ({
  cloneUrlBox: { url },
}) => (
  <OverlayTrigger
    trigger="click"
    placement="bottom"
    overlay={popoverBottom(url)}
  >
    <CloneButton>
      Clone or download
      {' '}
      <Glyphicon glyph="triangle-bottom" />
    </CloneButton>
  </OverlayTrigger>
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
