import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Glyphicon, OverlayTrigger } from 'react-bootstrap';
import CopyClipboardButton from 'components/shared/CopyClipboardButton';
import { PopoverBox, CopyBox, InputUrl, CloneButton } from './styles';

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
  repository: { url },
}) => (
  <OverlayTrigger
    rootClose
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
  repository: PropTypes.object.isRequired,
}

export default createFragmentContainer(CloneUrlBox, {
  repository: graphql`
    fragment CloneUrlBox_repository on Repository {
      url
    }
  `,
})
