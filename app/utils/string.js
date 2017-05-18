import moment from 'moment';

export const shortBranchName = branchName =>
  branchName.replace('refs/heads/', '')

export const shortUuid = uuid =>
  uuid.slice(0, 8)

export const timeFromNow = unixTime =>
  moment.unix(unixTime).fromNow()

export const lineCount = str =>
  str.split(/\r\n|\r|\n/).length

export const bytesToSize = (bytes, precision) => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;
  const terabyte = gigabyte * 1024;
  if ((bytes >= 0) && (bytes < kilobyte)) {
    return `${bytes} B`;
  } else if ((bytes >= kilobyte) && (bytes < megabyte)) {
    return `${(bytes / kilobyte).toFixed(precision)} KB`;
  } else if ((bytes >= megabyte) && (bytes < gigabyte)) {
    return `${(bytes / megabyte).toFixed(precision)} MB`;
  } else if ((bytes >= gigabyte) && (bytes < terabyte)) {
    return `${(bytes / gigabyte).toFixed(precision)} GB`;
  } else if (bytes >= terabyte) {
    return `${(bytes / terabyte).toFixed(precision)} TB`;
  }
  return `${bytes} B`;
}
