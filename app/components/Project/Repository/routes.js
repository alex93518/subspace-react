export const codeRoute = [
  { path: '/:userName/:projectName/:branchHead/commit/:commitId', name: 'Commit' },
  { path: '/:userName/:projectName/:branchHead/tree/*', name: 'TreeContainer' },
  { path: '/:userName/:projectName/:branchHead/blob/*', name: 'BlobContainer' },
  { path: '/:userName/:projectName/:branchHead/commits', name: 'Commits' },
  { path: '/:userName/:projectName/:branchHead/commits/*', name: 'Commits' },
  { path: '/:userName/:projectName/:branchHead/pendingcontributions', name: 'PendingContributions' },
  { path: '/:userName/:projectName/branches', name: 'Branches' },
  { path: '/:userName/:projectName/:branchHead', name: 'MainContainer' },
  { path: '/:userName/:projectName', name: 'MainContainer' },
];
