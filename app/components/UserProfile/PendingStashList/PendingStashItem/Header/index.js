import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { LinkProject } from 'components/shared/Links';
import { shortBranchName } from 'utils/string';
import FaCaretRight from 'react-icons/lib/fa/caret-right';
import FaCaretDown from 'react-icons/lib/fa/caret-down';
import { MainDiv, IconContainer } from './styles';

const Header = ({
  toggleShowContent, isShowContent, isClear,
  pendingStashItem: {
    name, repository,
    repository: { owner: { userName } },
  },
}) => (
  <MainDiv
    role="link"
    data-isClear={isClear}
    onClick={toggleShowContent}
  >
    <LinkProject vars={{ userName, projectName: repository.name }}>
      {repository.name}
    </LinkProject> / {shortBranchName(name)}
    <IconContainer>
      { isShowContent ? <FaCaretDown /> : <FaCaretRight />}
    </IconContainer>
  </MainDiv>
)

Header.propTypes = {
  pendingStashItem: PropTypes.object.isRequired,
  toggleShowContent: PropTypes.func.isRequired,
  isShowContent: PropTypes.bool.isRequired,
  isClear: PropTypes.bool.isRequired,
}

export default createFragmentContainer(Header, {
  pendingStashItem: graphql`
    fragment Header_pendingStashItem on Ref {
      repository {
        name
        owner {
          userName
        }
      }
      name
    }
  `,
})
