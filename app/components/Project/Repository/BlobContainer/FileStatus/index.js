import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { createContainer } from 'recompose-relay'
import { compose, mapProps } from 'recompose';
import { Table, ButtonGroup } from 'react-bootstrap';
import { lineCount, bytesToSize } from 'utils/string';
import { ButtonGit } from 'components/shared/ButtonGit';
import { LinkCommitsFile } from 'components/shared/Links';

const FileStatusTable = styled(Table)`
  margin-top: 15px;
  margin-bottom: -1px;
  background-color: #fafbfc;
  border:1px solid #ccc;
  border-bottom: 0px;
  border-radius:3px;
  border-bottom-right-radius:0;
  border-bottom-left-radius:0;
`

const FileInfoDivider = styled.span`
  display: inline-block;
  width: 1px;
  height: 18px;
  margin-right: 10px;
  margin-left: 10px;
  background-color: #ddd;
  vertical-align: middle;
`

const TdFileAction = styled.td`
  vertical-align: middle !important;
  text-align: right;
`

const TdFileInfo = styled.td`
  vertical-align: middle !important;
  padding-left: 10px;
`

const LinkHistoryFile = styled(LinkCommitsFile)`
  color: #777;
  &:focus,:hover {
    color: #999 !important;
  }
`

const FileStatus = ({ text, byteSize, vars, pathName }) => (
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
              <LinkHistoryFile vars={{ pathName, ...vars }}>
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
  vars: PropTypes.object.isRequired,
  pathName: PropTypes.string,
}

export default compose(
  createContainer({
    initialVariables: {
      branchHead: 'master',
      userName: null,
      projectName: null,
      splat: null,
    },
    fragments: {
      fileStatus: () => Relay.QL`
        fragment on TreeEntry {
          object {
            ... on Blob {
              text
              byteSize
            }
          }
        }
      `,
    },
  }),
  mapProps(({
    fileStatus: { object },
    relay: { variables },
  }) => ({
    ...object,
    vars: variables,
    pathName: variables.splat,
  }))
)(FileStatus)
