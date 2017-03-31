import React, { PropTypes } from 'react';
import { LinkBlue, GlyphiconBlue } from 'components/shared/Project/styled'
import { getTreeEntryPath, getParentPath } from 'utils/path';

const FolderUp = ({ projectPath, branchHead, path }) =>
  <tr>
    <td colSpan="4">
      <LinkBlue
        to={
          getTreeEntryPath(projectPath, 'tree', branchHead, getParentPath(path))
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
  path: PropTypes.string.isRequired,
  projectPath: PropTypes.string.isRequired,
}

export default FolderUp
