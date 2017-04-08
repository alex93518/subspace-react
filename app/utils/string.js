import moment from 'moment';

export const shortBranchName = branchName =>
  branchName.replace('refs/heads/', '')

export const timeFromNow = unixTime =>
  moment.unix(unixTime).fromNow()
