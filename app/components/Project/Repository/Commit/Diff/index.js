import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { LinkBlob } from 'components/shared/Links'

const CommitDiff = ({
  commitDiff: { diff },
  relay: { variables },
}) => (
  <div>
    <div>
      Showing {diff.length} changed files:
    </div>
    {
      diff.map(file =>
        <div key={`${file.oldPath}${file.newPath}`}>
          {
            file.changeType === 'DELETE' ? file.newPath :
            <LinkBlob vars={{ pathName: file.newPath, ...variables }}>
              {file.newPath}
            </LinkBlob>
          }
          {` - ${file.changeType}`}
        </div>
      )
    }
  </div>
)

CommitDiff.propTypes = {
  commitDiff: PropTypes.object.isRequired,
  relay: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommitDiff, {
  initialVariables: {
    branchHead: 'master',
    projectName: null,
    userName: null,
  },
  fragments: {
    commitDiff: () => Relay.QL`
      fragment on Commit {
        diff {
          changeType
          oldPath
          newPath
        }
      }
    `,
  },
})
