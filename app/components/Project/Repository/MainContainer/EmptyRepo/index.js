import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import { Table } from 'react-bootstrap';
import CopyClipboardButton from 'components/shared/CopyClipboardButton';

const TdQuickSetup = styled.td`
  background-color: #f1f8ff;
  border: 1px solid #c8e1ff !important;
  padding-left: 24px !important;
  padding-right: 24px !important;
  & btn {
    color: #fff;
  }
`
const InputUrl = styled.input`
  background-color: #fff;
  line-height: 20px;
  padding: 3px 10px;
  border: 1px solid #d1d5da;
  width: 80%;
`
const AbsBox = styled.span`
  position: absolute;
  right: 25px;
`
const TdRepo = styled.td`
  border: 1px solid #e1e4e8;
  border-top-color: transparent;
  padding-left: 24px !important;
  padding-right: 24px !important;
`
const TextInstruction = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5da;
  background-color: #f6f8fa;
  padding: 15px;
  font-size: 14px;
  color: #24292e;
`
const QuickSetupRecommend = styled.div`
  margin-top: 8px;
  margin-bottom: 10px;
`

const newRepoInstruction = url => `echo "# test" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin ${url}
git push -u origin master
`

const pushExistingInstruction = url => `git remote add origin ${url}
git push -u origin master
`

const EmptyRepo = ({ emptyRepo: { url } }) => (
  <Table>
    <tbody>
      <tr>
        <TdQuickSetup>
          <h3>Quick setup  — if you’ve done this kind of thing before</h3>
          <InputUrl value={url} readOnly />
          <CopyClipboardButton text={url} />
          <QuickSetupRecommend>
            We recommend every repository include a
            {' '}
            README, LICENSE, and .gitignore.
          </QuickSetupRecommend>
        </TdQuickSetup>
      </tr>
      <tr>
        <TdRepo>
          <h4>…or create a new repository on the command line</h4>
          <TextInstruction
            disabled
            readonly
            rows="7"
            value={newRepoInstruction(url)}
          />
          <AbsBox>
            <CopyClipboardButton text={newRepoInstruction(url)} />
          </AbsBox>
        </TdRepo>
      </tr>
      <tr>
        <TdRepo>
          <h4>…or push an existing repository from the command line</h4>
          <TextInstruction
            disabled
            readonly
            rows="3"
            value={pushExistingInstruction(url)}
          />
          <AbsBox>
            <CopyClipboardButton text={pushExistingInstruction(url)} />
          </AbsBox>
        </TdRepo>
      </tr>
    </tbody>
  </Table>
)

EmptyRepo.propTypes = {
  emptyRepo: PropTypes.object.isRequired,
}

export default Relay.createContainer(EmptyRepo, {
  fragments: {
    emptyRepo: () => Relay.QL`
      fragment on Repository {
        url
      }
    `,
  },
})
