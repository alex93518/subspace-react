import styled from 'styled-components';
import { Row, Panel, Media } from 'react-bootstrap';
import FaCommentO from 'react-icons/lib/fa/comment-o';
import Separator from 'components/shared/Separator';

export const PanelHead = styled(Panel)`
  padding: 15px;
  background: #f9f9f9;
  color: #777;
  border-color: #ddd;
`

export const H2Head = styled.h3`
  display: inline;
  margin-top: 0px;
  margin-right: -10px;
`

export const SpanStashNum = styled.span`
  margin-right: 20px;
`

export const StashLabel = styled.span`
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-weight: 600;
  background-color: #eaf5ff;
  color: #0366d6;
  border-radius: 3px;
  font-size: 13px;
  padding: 4px 8px;
  margin-right: 10px;
`

export const RowVoteStats = styled(Row)`
  margin-top: 10px;
`

export const NumberDiv = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #777;
`

export const SpanAcceptPoint = styled.span`
  font-weight: 700;
  color: #2cbe4e;
`

export const SpanRejectPoint = styled.span`
  font-weight: 700;
  color: #cb2431;
`

export const ProgressContainer = styled.div`
  height: 50px;
  width: 50px;
`

export const ProgressBody = styled(Media.Body)`
  padding-left: 10px;
`

export const CommentSeparator = styled(Separator)`
  margin-bottom: 10px;
`

export const CommentIcon = styled(FaCommentO)`
  vertical-align: text-top !important;
  margin-right: 7px;
`
