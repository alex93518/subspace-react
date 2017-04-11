import React from 'react';
import styled from 'styled-components'
import { compose, withState, withHandlers } from 'recompose'
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import { GoClippy } from 'react-icons/lib/go'

const ButtonCopy = styled(Button)`
  background-color: #eff3f6;
  color: #555;
  background-image: linear-gradient(-180deg, #fafbfc 0%, #eff3f6 90%);
  border: 1px solid rgba(27,31,35,0.2);
  padding: 3px 8px;
  font-size: 15px;
  &:focus {
    color: #999 !important;
  }
`

const tooltip = isCopied => (
  <Tooltip id="copyClipboard">
    <div style={{ width: 70 }}>
      {isCopied ? 'Copied' : 'Copy to clipboard'}
    </div>
  </Tooltip>
)

const enhance = compose(
  withState('isCopied', 'setIsCopied', false),
  withHandlers({
    onClick: props => () => {
      props.setIsCopied(true)
    },
    onExit: props => () => {
      setTimeout(() => (
        props.setIsCopied(false)
      ), 500)
    },
  })
)

const CopyClipboardButton = enhance(({
  isCopied, setIsCopied, onClick, onExit, ...props
}) => (
  <CopyToClipboard {...props}>
    <OverlayTrigger
      overlay={tooltip(isCopied)}
      placement="bottom"
      onExit={onExit}
    >
      <ButtonCopy onClick={onClick}>
        <GoClippy />
      </ButtonCopy>
    </OverlayTrigger>
  </CopyToClipboard>
))

export default CopyClipboardButton
