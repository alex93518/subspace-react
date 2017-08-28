import styled from 'styled-components';
import { LinkUserName } from 'components/shared/Links';
import { Field } from 'redux-form/immutable';
import MdThumbsUpDown from 'react-icons/lib/md/thumbs-up-down';
import GoRepo from 'react-icons/lib/go/repo';
import GoLock from 'react-icons/lib/go/lock';
import GoRepoPush from 'react-icons/lib/go/repo-push';

export const VotePush = styled(MdThumbsUpDown)`
  color: ${props => props['data-repoPushVote'] === 'pushVote' ? 'rgba(217,131,31,0.62)' : '#696e73'};
`

export const StandardPush = styled(GoRepoPush)`
  color: ${props => props['data-repoPushVote'] === 'standard' ? 'rgba(217,131,31,0.62)' : '#696e73'};
`

export const RepoPublic = styled(GoRepo)`
  color: ${props => props['data-repoAccess'] === 'public' ? 'rgba(217,131,31,0.62)' : '#696e73'};
`

export const RepoPrivate = styled(GoLock)`
  color: ${props => props['data-repoAccess'] === 'private' ? 'rgba(217,131,31,0.62)' : '#696e73'};
`

export const SpanSeparator = styled.span`
  display: inline-block;
  font-weight: 900;
  margin: 10px;
`

export const Dt = styled.dt`
  margin-bottom: 5px;
`

export const UserName = styled(LinkUserName)`
  margin-left: 5px;
`

export const DivOptHead = styled.div`
  margin-bottom: 10px;
`

export const SpanOpt = styled.span`
  font-weight: 900;
`

export const FloatDiv = styled.div`
  float: left;
  margin-right: 10px;
`

export const AccessDesc = styled.div`
  margin-top: -5px;
  float: left;
`

export const DlNoMargin = styled.dl`
  margin: 0;
`

export const RadioField = styled(Field)`
  margin-right: 5px !important;
`
