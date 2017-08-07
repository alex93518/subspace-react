import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { LinkProject } from 'components/shared/Links';
import { shortBranchName } from 'utils/string';

const Header = ({
  pendingStashItem: {
    name, repository,
    repository: { owner: { userName } },
  },
}) => (
  <h4>
    <LinkProject vars={{ userName, projectName: repository.name }}>
      {repository.name}
    </LinkProject> / #{shortBranchName(name)}
  </h4>
)

Header.propTypes = {
  pendingStashItem: PropTypes.object.isRequired,
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
