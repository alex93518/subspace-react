import styled, { keyframes } from 'styled-components';
import { Panel } from 'react-bootstrap';

export const MainDiv = styled.div`
  position: relative;
  padding-left: 60px;
  flex: 1;
`

export const DivLinkPhoto = styled.div`
  float: left;
  margin-left: -60px;
  border-radius: 3px;
`

export const PaddingKeyframes = isShowContent => keyframes`
  from {
    padding-top: ${isShowContent ? '0' : '15'}px;
    padding-bottom: ${isShowContent ? '0' : '15'}px;
  }
  to {
    padding-top: ${isShowContent ? '15' : '0'}px;
    padding-bottom: ${isShowContent ? '15' : '0'}px;
  }
`

export const PanelComment = styled(Panel)`
  border: 0px;
  & .panel-heading {
    background: #fcfcfc;
    color: #777;
    border: 1px solid ${props => {
      let color = '#ddd';
      if (props['data-isOwnerVoteUp'] !== null) {
        if (props['data-isOwnerVoteUp']) {
          color = 'rgba(45, 132, 48, 0.6)'
        } else {
          color = 'rgba(169, 12, 12, 0.6)'
        }
      }
      return color
    }};
    border-left: ${props => {
      let border = '1px solid #ddd'
      if (props['data-isOwnerVoteUp'] !== null) {
        if (props['data-isOwnerVoteUp']) {
          border = '6px solid rgba(45, 132, 48, 0.6)'
        } else {
          border = '6px solid rgba(169, 12, 12, 0.6)'
        }
      }
      return border
    }};
  }
  & .panel-body {
    -webkit-animation: ${props => PaddingKeyframes(props['data-isShowContent'])} 0.3s; /* Safari 4+ */
    -moz-animation:    ${props => PaddingKeyframes(props['data-isShowContent'])} 0.3s; /* Fx 5+ */
    -o-animation:      ${props => PaddingKeyframes(props['data-isShowContent'])} 0.3s; /* Opera 12+ */
    animation:         ${props => PaddingKeyframes(props['data-isShowContent'])} 0.3s; /* IE 10+, Fx 29+ */
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding-top: ${props => props['data-isShowContent'] ? '15' : '0'}px;
    padding-bottom: ${props => props['data-isShowContent'] ? '15' : '0'}px;
  }
  & .panel-footer {
    border: 1px solid #ddd;
  }
`
