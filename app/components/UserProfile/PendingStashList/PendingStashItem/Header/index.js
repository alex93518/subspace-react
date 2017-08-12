import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import moment from 'moment';
import { LinkProject } from 'components/shared/Links';
import { shortBranchName } from 'utils/string';
import { TimeSpane } from './styles';

const Header = ({
  createdAt,
  pendingStashItem: {
    name, repository,
    repository: { owner: { userName } },
  },
}) => (
  <span>
    <LinkProject vars={{ userName, projectName: repository.name }}>
      {repository.name}
    </LinkProject> / {shortBranchName(name)}
    <TimeSpane>
      pushed {moment(createdAt).fromNow()}
    </TimeSpane>
  </span>
)

Header.propTypes = {
  pendingStashItem: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
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
