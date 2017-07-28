import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { Table } from 'react-bootstrap';
import CopyClipboardButton from 'components/shared/CopyClipboardButton';
import {
  TdQuickSetup, InputUrl, QuickSetupRecommend,
  TdRepo, TextInstruction, AbsBox,
} from './styles';

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

export default createFragmentContainer(EmptyRepo, {
  emptyRepo: graphql`
    fragment EmptyRepo_emptyRepo on Repository {
      url
    }
  `,
})
