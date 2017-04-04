import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { TableWhite, RowSty } from 'components/shared/Project/styled';

const CommitDetails = ({
  commitDetails: {
    ref: {
      commit: {
        fullMessage,
        diff,
      },
    },
  },
}) => (
  <RowSty>
    <TableWhite>
      <tbody>
        <tr>
          <td>{fullMessage}</td>
        </tr>
        <tr>
          <td>{diff[0] ? diff[0].changeType : ''}</td>
        </tr>
        <tr>
          <td>{diff[0] ? diff[0].oldPath : ''}</td>
        </tr>
      </tbody>
    </TableWhite>
  </RowSty>
)

CommitDetails.propTypes = {
  commitDetails: PropTypes.object.isRequired,
}

export default Relay.createContainer(CommitDetails, {
  initialVariables: {
    branchHead: 'master',
    commitId: null,
  },
  fragments: {
    commitDetails: () => Relay.QL`
      fragment on Repository {
        ref(refName: $branchHead) {
          commit(commitId: $commitId) {
            oid
            shortId
            fullMessage
            diff {
              changeType
              oldPath
              newPath
            }
          }
        }
      }
    `,
  },
})
