import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import withRelayFragment from 'relay/withRelayFragment';
import { compose, mapProps } from 'recompose';
import { ButtonGroup } from 'react-bootstrap';
import { lineCount, bytesToSize } from 'utils/string';
import { ButtonGit } from 'components/shared/ButtonGit';
import { withRouter } from 'react-router-dom';
import { matchRoute } from 'utils/routeMatcher';
import {
  FileStatusTable, TdFileInfo, FileInfoDivider,
  TdFileAction, LinkHistoryFile,
} from './styles';

const FileStatus = ({ text, byteSize, splat }) => (
  <FileStatusTable>
    <tbody>
      <tr>
        <TdFileInfo>
          {lineCount(text)} lines
          <FileInfoDivider />
          {bytesToSize(byteSize, 2)}
        </TdFileInfo>
        <TdFileAction>
          <ButtonGroup>
            <ButtonGit disabled>Raw</ButtonGit>
            <ButtonGit disabled>Blame</ButtonGit>
            <ButtonGit>
              <LinkHistoryFile to={splat}>
                History
              </LinkHistoryFile>
            </ButtonGit>
          </ButtonGroup>
        </TdFileAction>
      </tr>
    </tbody>
  </FileStatusTable>
)

FileStatus.propTypes = {
  byteSize: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  splat: PropTypes.string,
}

export default compose(
  withRouter,
  withRelayFragment({
    fileStatus: graphql`
      fragment FileStatus_fileStatus on TreeEntry {
        object {
          ... on Blob {
            text
            byteSize
          }
        }
      }
    `,
  }),
  mapProps(({
    fileStatus: { object },
    location: { pathname },
  }) => ({
    ...object,
    splat: matchRoute(pathname).params['0'] || null,
  }))
)(FileStatus)
