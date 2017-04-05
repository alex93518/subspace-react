import React, { PropTypes } from 'react';
import { LinkBlue, GlyphiconBlue } from 'components/shared/Project/styled'
import { getTreeEntryPath, getParentPath } from 'utils/path';

const FolderUp = ({ userName, projectName, branchHead, splat }) =>
  <tr>
    <td colSpan="4">
      <LinkBlue
        to={
          getTreeEntryPath(
            { userName, projectName, branchHead },
            'tree',
            getParentPath(splat)
          )
        }
      >
        <span style={{ paddingRight: 10 }}>
          <GlyphiconBlue glyph="folder-open" />
        </span>
        ..
      </LinkBlue>
    </td>
  </tr>

FolderUp.propTypes = {
  branchHead: PropTypes.string.isRequired,
  splat: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
}

export default FolderUp
