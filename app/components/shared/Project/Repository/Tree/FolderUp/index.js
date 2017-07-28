import React from 'react';
import PropTypes from 'prop-types';
import { LinkTreeEntry } from 'components/shared/Links';
import styled from 'styled-components';
import { Glyphicon } from 'react-bootstrap';
import { getParentPath } from 'utils/path';

const GlyphTreeEntry = styled(Glyphicon)`
  color: rgba(3,47,98,0.5);
`

const LinkTree = styled(LinkTreeEntry)`
  color: #0366d6;
`

const FolderUp = ({ userName, projectName, branchHead, splat }) =>
  (<tr>
    <td colSpan="4">
      <LinkTree
        vars={{
          userName,
          projectName,
          branchHead,
          type: 'tree',
          pathName: getParentPath(splat),
        }}
      >
        <span style={{ paddingRight: 10 }}>
          <GlyphTreeEntry glyph="folder-open" />
        </span>
        ..
      </LinkTree>
    </td>
  </tr>)

FolderUp.propTypes = {
  branchHead: PropTypes.string.isRequired,
  splat: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
}

export default FolderUp
